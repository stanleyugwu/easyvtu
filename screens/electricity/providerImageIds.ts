/**
 * An object containing the google drive IDs of the electricity
 * provider images. The keys match keys from server so don't change it
 */
const PROVIDERIMAGEIDS = Object.freeze({
  abuja: '1CMGDO6t2wwkxkcyfIabRzyUikWuIu9m1',
  eko: '18bkMl7rNmDxFS1exXvyP0NjOvD0xsfQ5',
  ikeja: '1yFMwMt0Qt_pLcs3BetWFvEHl0N1KSJL5',
  ibadan: '1uQ-3qHXcYSg_4trMRc6qITHmEsXCmKVD',
  enugu: '1CKgvytX5eGYVKnaUUZEjksaw_9mzANT_',
  ph: '1YAnb4pEgHKQRMGLyrA0o7wmUByPUcLd3',
  jos: '1iKIH_CAPJeu7YalREcI1Tb4OXc3Ldt-g',
  kaduna: '14XpJPCrAAuCJJ7htxttyZSUXv5crxFPs',
  kano: '1Wy_pmZwrEccN-uEOby3r6wMTHzE1ZhOp',
  bh: '1yAu1kzKBnY0CpcaOTC7x5B_Rl9vkWWAM',
});

export type ElectricityProviderName = keyof typeof PROVIDERIMAGEIDS

export default PROVIDERIMAGEIDS;
