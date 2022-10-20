export type WalletTransaction = {
  id: number;
  user_id: string;
  trans_no: string;
  username: string;
  email: string;
  phone: string;
  amount: number;
  payment_method: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ReceiptInfo = {
  "Transaction ID": string;
  "Amount": string;
  "Payment Method": string;
  "Type": string;
  "Status": string;
  "Date": string;
};
