import {Carrier} from '../screens/airtime/airtime.d';

/**
 * 2D array of network carrier prefixes.
 * We froze it to prevent accidental mutation.
 * This data is highly important, mistakes in it will break the entire carrier
 * detection feature
 */
const NETWORKCARRIERPREFIXES = Object.freeze([
  /** MTN PREFIXES */
  [
    '0803',
    '0806',
    '0703',
    '0706',
    '0813',
    '0816',
    '0810',
    '0814',
    '0903',
    '0906',
    '0913',
    '0916',
  ],

  /** AIRTEL PREFIXES */
  [
    '0802',
    '0808',
    '0708',
    '0812',
    '0701',
    '0902',
    '0901',
    '0904',
    '0907',
    '0912',
  ],

  /** GLO PREFIXES */
  ['0805', '0807', '0705', '0815', '0811', '0905', '0915'],

  /** ETISALAT PREFIXES */
  ['0809', '0818', '0817', '0909', '0908'],
] as const);

// creates regex union from array
const createUnion = (dataArr: readonly string[]) =>
  Object.values(dataArr).join('|');

/**
 * Detects carrier network from a given phone number.
 * The detection process is to concat all the string values of
 * a particular network prefixes into a regex union and then test
 * the regex against the given phone number.
 *
 * @param phoneNumber Phone number to detect carrier network from
 * @return {Carrier | undefined} The detected carrier name
 */
const detectCarrierFromPhoneNumber = (
  phoneNumber: string,
): Carrier | undefined => {
  // prefixes union
  const mtnPrefixes = createUnion(NETWORKCARRIERPREFIXES[0]),
    airtelPrefixes = createUnion(NETWORKCARRIERPREFIXES[1]),
    gloPrefixes = createUnion(NETWORKCARRIERPREFIXES[2]),
    etisalatPrefixes = createUnion(NETWORKCARRIERPREFIXES[3]);

  // creates regex from union and checks for match
  const matches = (union: string) =>
    new RegExp(`^(${union})`).test(phoneNumber);

  if (matches(mtnPrefixes)) return Carrier.Mtn;
  else if (matches(airtelPrefixes)) return Carrier.Airtel;
  else if (matches(gloPrefixes)) return Carrier.Glo;
  else if (matches(etisalatPrefixes)) return Carrier.Etisalat;
  else return undefined;
};

export default detectCarrierFromPhoneNumber;
