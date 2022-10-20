export interface UserTxHistory {
  id: number;
  user_id: string;
  trans_no: string;
  username: string;
  email: string;
  phone: string;
  service: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
}
export type service = 'airtime' | 'data' | 'tv' | 'result' | 'electricity';

/**
 * Receipt structure in the form it will be passed to `TxReceiptOverlay` component
 */
export type UserTxReceiptInfo = {
  'Transaction ID': string;
  Amount: string;
  'Payment Method': string;
  'Receipient': string;
  Service: string;
  Status: string;
  Date: string;
};

// TODO: request for proper field name to describe the receipient of a service e.g `iuc_number` for cable 
// subscription or `meter_no` for Electricity instead of generic name `phone`
