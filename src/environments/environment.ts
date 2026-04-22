const sessionStorageEncKey = '';
const commonAPI = 'https://uatamrit.piramalswasthya.org/common-api/';
const adminAPI = 'https://uatamrit.piramalswasthya.org/admin-api/';
const telephoneServer = 'https://uatcz.piramalswasthya.org/';
// const telephoneServer = 'https://uatamrit.piramalswasthya.org/';
const API1097 = 'https://uatamrit.piramalswasthya.org/1097-api/';
const siteKey = '0x4AAAAAABd2NBhFelo_kuP_';
const captchaChallengeURL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const enableCaptcha = false;
const openKMBaseURL = 'uatamrit.piramalswasthya.org:8084/OpenKM';
 ''

export const environment = {
  production: false,
  invalidCallType: 'Invalid',
  encKey: sessionStorageEncKey,
  commonAPI: commonAPI,
  ip1097: API1097,
  telephoneServer: telephoneServer,
  adminAPI: adminAPI,
  siteKey:siteKey,
  captchaChallengeURL:captchaChallengeURL,
  enableCaptcha: enableCaptcha,
  openKMBaseURL: openKMBaseURL,
};