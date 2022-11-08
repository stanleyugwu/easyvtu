export enum Carrier {
  Mtn = 'mtn',
  Airtel = 'airtel',
  Glo = 'glo',
  Etisalat = 'etisalat',
}

export type IncompleteTopUp = {
  phone: string;
  amount: number;
  carrier: Carrier;
};
