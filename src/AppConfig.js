let trackId = "UA-XXXXXXXXX-X";

let apiUrl = `http://app.staging.globalsystemsmanagement.net`,
  facebookAppId,
  googleClientId,
  googleApiScopes,
  facebookApiScopes;

let linkedinApiScopes =
  "/people/~:(email-address,first-name,last-name)?format=json";

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_BUILD_ENV === "staging"
)
  trackId = "UA-111295206-1";

if (
  process.env.NODE_ENV === "development" ||
  process.env.REACT_APP_BUILD_ENV === "staging"
) {
  googleClientId =
    "230475327404-4dcmdt79d6kgau7h084rm10uj5ri10s5.apps.googleusercontent.com";
  facebookAppId = "1633545903429163";
  googleApiScopes =
    "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
  facebookApiScopes =
    "/me?fields=id,name,picture,email,birthday,devices,education,gender,is_verified,first_name,last_name";
}

if (process.env.NODE_ENV == "development") {
  apiUrl = "http://localhost:8000";
}

export default {
  GA_TRACKING_ID: trackId,
  API_URL: apiUrl,
  FACEBOOK_APP_ID: facebookAppId,
  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_API_SCOPES: googleApiScopes,
  FACEBOOK_API_SCOPES: facebookApiScopes,
  LINKEDIN_API_SCOPES: linkedinApiScopes
};
