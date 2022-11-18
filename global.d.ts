/**
 * App Core Services
 */
export type AppServices =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable tv'
  | 'scratch card';

/**
 * IDs for fetching variations and plans for different app services
 */
export type AppServicePlansId =
  | 'mtn-data'
  | 'airtel-data'
  | 'glo-data'
  | 'etisalat-data'
  | 'dstv'
  | 'gotv'
  | 'startimes'
  | 'waec';

/**
 * Returns the type of array items
 */
export type ArrayElementType<Type> = Type extends (infer ItemType)[]
  ? ItemType
  : Type;

// JOKE: Brute force detect the element type of the resolved value of the promise returned by `getServicesPlans`
// let a: Parameters<
//   Parameters<ReturnType<typeof getServicePlans>['then']>[0]
// >[0]['data']['variations'] extends Array<infer IT>
//   ? IT
//   : any;
