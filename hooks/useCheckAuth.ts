import React, {useEffect, useState} from 'react';
import useAppStore from '../store';

type useAuthReturn = {
  checkingAuth: boolean;
  isLoggedIn: boolean;
  signIn: Function;
  signOut: Function;
};

/**
 * Checks logged in user by looking for stored login creds.
 * Exports services for signing in and out
 */
const useCheckAuth = (): useAuthReturn => {
  const [checkingAuthCreds, setCheckingAuthCred] = useState(true);
  const isLoggedIn = useAppStore(state => state.isLoggedIn);
  const [signIn, signOut] = useAppStore(state => [state.signIn, state.signOut]);

  useEffect(() => {
    const storedToken = globalThis.secureStorage.getString('__$auth_token$__');
    if (storedToken) {
      signIn();
      // store token globally
      // @ts-ignore
      globalThis.$token$ = storedToken;
    }
    setCheckingAuthCred(false);
  }, []);

  return {
    checkingAuth: checkingAuthCreds,
    isLoggedIn,
    signIn,
    signOut,
  };
};

export default useCheckAuth;
