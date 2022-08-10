import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {
  createContext,
  ReducerWithoutAction,
  useReducer,
  useState,
} from 'react';

interface IFirebaseAuthProviderContext {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
}

export const FirebaseAuthProviderContext = createContext<
  IFirebaseAuthProviderContext
>({
  user: null,
  initializing: true,
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
  const [initializing, setInitializing] = useState<boolean>(true);

  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setInitializing(false);
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
        initializing,
      }}>
      {children}
    </FirebaseAuthProviderContext.Provider>
  );
};

export const useFirebaseAuth = () =>
  React.useContext(FirebaseAuthProviderContext);
