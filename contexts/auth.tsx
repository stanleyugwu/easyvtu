import React from 'react';

type AuthContextType = {
    signIn:Function,
    signOut:Function
}

/**
 * Context for common auth services like signup and signout
 */
const AuthContext = React.createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
});

export default AuthContext;
