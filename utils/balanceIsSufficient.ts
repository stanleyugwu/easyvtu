import useAppStore from '../store';

/**
 * Checks if user's current wallet balance is sufficient for a transaction with given amount
 * @param {number} txAmount - The cost of the transaction. Amount to check balance against.
 */
const balanceIsSufficient = (txAmount: number) => {
  const usersBal = useAppStore.getState()?.profile?.wallet_balance;
  if (!usersBal /* 0 or '' or undefined */) return false;

  return typeof +usersBal === 'number' && +usersBal >= txAmount;
};

export default balanceIsSufficient;
