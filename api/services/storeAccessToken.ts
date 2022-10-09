/**
 * Stores user jwt token globally
 */
const storeAccessToken = (token: string) => {
  // @ts-ignore
  globalThis.$token$ = token;
};

export default storeAccessToken;
