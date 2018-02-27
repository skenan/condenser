// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'CNSteem';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'CNSteem';
export const APP_NAME_UPPERCASE = 'CNSTEEM';
export const APP_ICON = 'cnsteem';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://cnsteem.com';
export const APP_DOMAIN = 'cnsteem.com';
export const LIQUID_TOKEN = 'Steem';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'STEEM';
export const VESTING_TOKEN = 'STEEM POWER';
export const INVEST_TOKEN_UPPERCASE = 'STEEM POWER';
export const INVEST_TOKEN_SHORT = 'SP';
export const DEBT_TOKEN = 'STEEM DOLLAR';
export const DEBT_TOKENS = 'STEEM DOLLARS';
export const CURRENCY_SIGN = '$';
export const WIKI_URL = ''; // https://wiki.golos.io/
export const LANDING_PAGE_URL = 'https://steem.io/';
export const TERMS_OF_SERVICE_URL = 'https://' + APP_DOMAIN + '/tos.html';
export const PRIVACY_POLICY_URL = 'https://' + APP_DOMAIN + '/privacy.html';
export const WHITEPAPER_URL = 'https://steem.io/SteemWhitePaper.pdf';

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'STEEM';
export const VEST_TICKER = 'VESTS';
export const DEBT_TICKER = 'SBD';
export const DEBT_TOKEN_SHORT = 'SBD';

// application settings
export const DEFAULT_LANGUAGE = 'zh'; // used on application internationalization bootstrap
export const DEFAULT_CURRENCY = 'USD';
export const ALLOWED_CURRENCIES = ['USD'];
export const FRACTION_DIGITS = 2; // default amount of decimal digits
export const FRACTION_DIGITS_MARKET = 3; // accurate amount of deciaml digits (example: used in market)

// meta info
export const TWITTER_HANDLE = '@steemit';
export const SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/steemit-share.png';
export const TWITTER_SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/steemit-twshare.png';
export const SITE_DESCRIPTION = 'CNsteem是Steemit的中文版，在这里你可以通过发表和给文章点赞来赚取Steem加密货币。';

// various
export const SUPPORT_EMAIL = 'cnsteem@gmail.com';
