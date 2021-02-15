import { useEffect, useState } from "react"
import getFirebaseInstance from "./firebase"
import loadFirebaseDependencies from "./loadFirebaseDependencies"

function useAuth() {
  const [user, setUser] = useState(null)
  const [firebase, setFirebase] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe
    let publicProfileUnsubscribe

    loadFirebaseDependencies.then(app => {
      const firebaseInstance = getFirebaseInstance(app)
      setFirebase(firebaseInstance)

      unsubscribe = firebaseInstance.auth.onAuthStateChanged(userResult => {
        if (userResult) {
          publicProfileUnsubscribe = firebaseInstance.getUserProfile({
            userId: userResult.uid,
            onSnapshot: r => {
              firebaseInstance.auth.currentUser
                .getIdTokenResult(true)
                .then(token => {
                  setUser({
                    ...userResult,
                    isAdmin: token.claims.admin,
                    username: r.empty ? null : r.docs[0].id,
                  })
                })
            },
          })
        } else {
          if (publicProfileUnsubscribe) {
            publicProfileUnsubscribe()
          }
          setUser(null)
        }

        setLoading(false)
      })
    })

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return { user, firebase, loading }
}

export default useAuth
