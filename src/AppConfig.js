let trackId = "UA-XXXXXXXXX-X";

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_BUILD_ENV === "staging"
)
  trackId = "UA-111295206-1";

export default {
  GA_TRACKING_ID: trackId
};
