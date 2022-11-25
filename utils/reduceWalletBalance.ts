import useAppStore from '../store';

/**
 * Reduces user's wallet balance by given amount.
 * This will be typically called after wallet payment for a transaction
 */
const reduceWalletBalanceBy = (amount: number) => {
  const [userBal, updateProfile] = [
    useAppStore.getState()?.profile?.wallet_balance,
    useAppStore.getState()?.setProfile,
  ];
  if (!userBal) return;
  updateProfile?.({
    wallet_balance: `${+userBal - +amount || 0}`,
  });
};

export default reduceWalletBalanceBy;
