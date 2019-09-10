import { useEffect, useState } from "react"
import getFirebaseInstance from "./firebase"
import loadFirebaseDependencies from "./loadFirebaseDependencies"

function useAuth() {
    const [user, setUser] = useState(null);
    const [firebase, setFirebase] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unmounted = false;
        let unsubscribe;
        let publicProfileUnsubscribe;

        if(!unmounted) {
            loadFirebaseDependencies.then(app => {
                if (!unmounted) {
                    const firebaseInstance = getFirebaseInstance(app);
                    setFirebase(firebaseInstance);

                    unsubscribe = firebaseInstance.auth.onAuthStateChanged(userResult => {
                        if (userResult && !unmounted) {
                            // get user custom claims
                            Promise.all([
                              firebaseInstance.getUserProfile({userId: userResult.uid}),
                              firebaseInstance.auth.currentUser.getIdTokenResult(true)
                            ]).then((result) => {
                                const publicProfileResult = result[0];
                                const token = result[1];

                                if(!unmounted) {
                                    //console.log(publicProfileResult);
                                    if(publicProfileResult.empty){
                                        publicProfileUnsubscribe = firebaseInstance.db
                                          .collection('publicProfiles')
                                          .where("userId", "==", userResult.uid)
                                          .onSnapshot((snapshot) => {
                                              if(!unmounted) {
                                                  const publicProfileDoc = snapshot.docs[0];
                                                  if (publicProfileDoc && publicProfileDoc.id) {
                                                      setUser({
                                                          ...userResult,
                                                          admin: token.claims.admin,
                                                          username: publicProfileDoc.id
                                                      });
                                                  }

                                                  setLoading(false);
                                              }
                                          });
                                    }else{
                                        const publicProfileDoc = publicProfileResult.docs[0];
                                        if (publicProfileDoc && publicProfileDoc.id) {
                                            setUser({
                                                ...userResult,
                                                admin: token.claims.admin,
                                                username: publicProfileDoc.id
                                            });
                                        }

                                        setLoading(false);
                                    }
                                }
                            });
                        } else if(!unmounted) {
                            setUser(null);
                            setLoading(false);
                        }
                    })
                }
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }

            if(publicProfileUnsubscribe){
                publicProfileUnsubscribe();
            }

            unmounted = true
        }
    }, [])

    return { user, firebase, loading };
}

export default useAuth
