/**
 * Persists jwt token on user device and stores it globally for app use
 */
const storeAccessToken = (token: string) => {
  // @ts-ignore
  globalThis.$token$ = token;
  globalThis.secureStorage.setString('__$auth_token$__',token);
};

export default storeAccessToken;
