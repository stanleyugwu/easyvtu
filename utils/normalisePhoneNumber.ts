/**
 * Normalises phone number, removes non-integer characters and
 * handles carrier prefixes e.g +234
 */
const normalisePhoneNumber = (mobileNumber: string): string => {
  if (!mobileNumber || typeof mobileNumber !== 'string') return '';

  // remove everything not number
  mobileNumber = mobileNumber.replace(/[^0-9]/gi, '');

  // 234903...
  if (mobileNumber.startsWith('234')) {
    // 2340903...
    if (mobileNumber[3] === '0') {
      return mobileNumber.substring(3);
    }
    // 234903...
    else return '0' + mobileNumber.substring(3);
  }
  // 903...
  else if (!mobileNumber.startsWith('0')) return `0${mobileNumber}`;
  // 0903...
  return mobileNumber;
};

export default normalisePhoneNumber;
