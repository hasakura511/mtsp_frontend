let trackId = "UA-XXXXXXXXX-X";

let apiUrl = "";

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_BUILD_ENV === "staging"
)
  trackId = "UA-111295206-1";

if (
  process.env.NODE_ENV === "development" ||
  process.env.REACT_APP_BUILD_ENV === "staging"
)
  apiUrl = `http://app.staging.globalsystemsmanagement.net`;

export default {
  GA_TRACKING_ID: trackId,
  API_URL: apiUrl
};
