import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { createContext, ReducerWithoutAction, useReducer, useState } from 'react'

interface FirebaseAuthProviderProps {

}

interface IFirebaseAuthProviderContext {
  state: State,
  dispatch: React.Dispatch<Action>
}

export const FirebaseAuthProviderContext = createContext<IFirebaseAuthProviderContext>({
  state: { user: null, initializing: false },
  dispatch: () => { }
});

type State = {
  user: FirebaseAuthTypes.User | null,
  initializing: boolean
}

type Action =
  | { type: ACTION_TYPES.SIGNIN; user: FirebaseAuthTypes.User }
  | { type: ACTION_TYPES.SIGNOUT } | { type: ACTION_TYPES.INITIALIZING } | { type: ACTION_TYPES.DONE_INITIALIZING }


enum ACTION_TYPES {
  SIGNIN = 'SIGNIN',
  SIGNOUT = 'SIGNOUT',
  INITIALIZING = 'INITIALIZING',
  DONE_INITIALIZING = 'DONE_INITIALIZING'
}


const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.SIGNIN:
      return { ...state, user: action.user };
    case ACTION_TYPES.SIGNOUT:
      return { ...state, user: null };
    case ACTION_TYPES.INITIALIZING:
      return { ...state, initializing: true }
    case ACTION_TYPES.DONE_INITIALIZING:
      return { ...state, initializing: false }
    default:
      throw new Error();
  }
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, { user: null, initializing: false });

  const onAuthStateChanged = (user: any) => {
    dispatch({ type: ACTION_TYPES.SIGNIN, user });
    console.log(user)
    if (state.initializing) dispatch({ type: ACTION_TYPES.DONE_INITIALIZING });
  }

  const signInAnnon = async () => {
    auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }

        console.error(error);
      });
  }

  React.useEffect(() => {
    signInAnnon();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <FirebaseAuthProviderContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {children}
    </FirebaseAuthProviderContext.Provider>
  );
}