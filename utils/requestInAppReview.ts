import InAppReview from 'react-native-in-app-review';

// 7 days in milliseconds
const INTERVAL = 604_800_000;
const reviewDateStorageKey = '__last_review_prompt_date__';

/**
 * Handles in-app review for android and iOS.
 * We prompt for reviews only atfer top-up and after 7 days
 * from last prompt
 */
const requestInAppReview = async () => {
  const reviewSupported = InAppReview.isAvailable();
  try {
    const lastPrompt = await globalThis.secureStorage.getIntAsync(
      reviewDateStorageKey,
    );
    const intervalIsEnough = !lastPrompt || Date.now() - lastPrompt >= INTERVAL;

    if (reviewSupported && intervalIsEnough) {
      const flowLaunched = await InAppReview.RequestInAppReview();
      if (flowLaunched) {
        // flow is launched. we can't tell if user has reviewed or not (android & iOS)
        // so we continue our flow. What we are sure of is that prompt won't appear when
        // user has already reviewed
        await globalThis.secureStorage.setIntAsync(
          reviewDateStorageKey,
          Date.now(),
        );
      }
    }

    return true;
  } catch (error) {
    // fails silently
    return false;
  }
};

export default requestInAppReview;
