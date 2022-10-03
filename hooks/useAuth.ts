//import libraries
import React from 'react';
import AuthContext from '../contexts/auth';

// wrapper hook for AuthContext
const useAuth = () => {
  return React.useContext(AuthContext);
};

export default useAuth;
