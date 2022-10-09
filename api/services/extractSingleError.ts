import { RawServerErrorMessage } from "../api";

/**
 * Extracts and concatenates errors returned by server.
 * It transforms all server errors to single formatted string
 */
const extractSingleError = (error: RawServerErrorMessage): string => {
  if (!(error instanceof Object))
    return 'An error occured on our side. please try again';
  return Object.values(error).flat(5).join('.\n');
};

export default extractSingleError;
