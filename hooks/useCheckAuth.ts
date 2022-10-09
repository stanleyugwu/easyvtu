import React, {useEffect, useState} from 'react';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = globalThis.secureStorage.getString('__$auth_token$__');
    if (storedToken) {
      setIsLoggedIn(true);
    }
    setCheckingAuthCred(false);
  }, []);

  // just services shorthand for provider
  const signIn = React.useCallback(() => setIsLoggedIn(true), []);
  const signOut = React.useCallback(() => setIsLoggedIn(false), []);

  return {
    checkingAuth: checkingAuthCreds,
    isLoggedIn,
    signIn,
    signOut,
  };
};

export default useCheckAuth;
