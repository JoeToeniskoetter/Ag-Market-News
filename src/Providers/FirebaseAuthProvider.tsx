import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {
  createContext,
  ReducerWithoutAction,
  useReducer,
  useState,
} from 'react';

interface IFirebaseAuthProviderContext {
  user: FirebaseAuthTypes.User | null;
}

export const FirebaseAuthProviderContext =
  createContext<IFirebaseAuthProviderContext>({
    user: null,
  });

type Action =
  | {type: ACTION_TYPES.SIGNIN; user: FirebaseAuthTypes.User}
  | {type: ACTION_TYPES.SIGNOUT}
  | {type: ACTION_TYPES.INITIALIZING}
  | {type: ACTION_TYPES.DONE_INITIALIZING};

enum ACTION_TYPES {
  SIGNIN = 'SIGNIN',
  SIGNOUT = 'SIGNOUT',
  INITIALIZING = 'INITIALIZING',
  DONE_INITIALIZING = 'DONE_INITIALIZING',
}

export const FirebaseAuthProvider: React.FC<{}> = ({children}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        // user
        //   .getIdToken()
        //   .then(token => console.log(token))
        //   .catch(e => {
        //     auth()
        //       .signOut()
        //       .then(() => {
        //         auth().signInAnonymously();
        //       });
        //   });
      } else {
        setUser(null);
      }
    });

    if (!auth().currentUser) {
      auth().signInAnonymously();
    }

    return unsubscribe();
  }, []);

  return (
    <FirebaseAuthProviderContext.Provider
      value={{
        user,
      }}>
      {children}
    </FirebaseAuthProviderContext.Provider>
  );
};

export const useFirebaseAuth = () =>
  React.useContext(FirebaseAuthProviderContext);
