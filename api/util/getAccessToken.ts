/**
 * Extracts and returns logged in user's access token
 */
const getAccessToken = (): string | undefined => {
  // @ts-ignore
  return globalThis.$token$ as string;
};

export default getAccessToken;
