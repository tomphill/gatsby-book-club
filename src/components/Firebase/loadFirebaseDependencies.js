const app = import('firebase/app');
const auth = import('firebase/auth');
const database = import('firebase/firestore');
const functions = import('firebase/functions');
const storage = import('firebase/storage');

const loadFirebaseDependencies = Promise.all([app, auth, database, functions, storage]).then(values => {
  return values[0];
});

export default loadFirebaseDependencies;