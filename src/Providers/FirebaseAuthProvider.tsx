import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {
  createContext,
  ReducerWithoutAction,
  useEffect,
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

enum ACTION_TYPES {
  SIGNIN = 'SIGNIN',
  SIGNOUT = 'SIGNOUT',
  INITIALIZING = 'INITIALIZING',
  DONE_INITIALIZING = 'DONE_INITIALIZING',
}

export const FirebaseAuthProvider: React.FC<{}> = ({children}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
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
