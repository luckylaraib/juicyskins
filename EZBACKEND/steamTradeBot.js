const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const SteamTradeManager = require('steam-tradeoffer-manager');
const SteamTotp = require('steam-totp');

// Configure simple console-based logging
const log = (message) => console.log(`[LOG] ${message}`);
const warn = (message) => console.warn(`[WARN] ${message}`);
const error = (message) => console.error(`[ERROR] ${message}`);

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new SteamTradeManager({
  steam: client,
  community: community,
  language: 'en',
  useAccessToken: true
});

// Steam bot credentials from environment variables
const config = {
  accountName: process.env.STEAM_ACCOUNT_NAME,
  password: process.env.STEAM_PASSWORD,
  sharedSecret: process.env.STEAM_SHARED_SECRET,
  identitySecret: process.env.STEAM_IDENTITY_SECRET
};

// Avoid logging sensitive information
log('Config: Account Name is set.');

// Validate Steam credentials
if (!config.accountName || !config.password || !config.sharedSecret || !config.identitySecret) {
  error('Steam credentials are not fully set in environment variables.');
  process.exit(1);
}

let loginAttempts = 0;
let reconnectAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 10;
const MAX_RECONNECT_ATTEMPTS = 5;

// Critical errors that require re-login
const criticalErrors = [
  SteamUser.EResult.NotLoggedOn,
  SteamUser.EResult.NoConnection,
  SteamUser.EResult.InvalidPassword,
  SteamUser.EResult.Timeout,
  SteamUser.EResult.ConnectFailed,
  SteamUser.EResult.HandshakeFailed,
  SteamUser.EResult.RemoteDisconnect,
  SteamUser.EResult.AccountNotFound,
  SteamUser.EResult.ServiceUnavailable,
  SteamUser.EResult.RateLimitExceeded,
  SteamUser.EResult.InvalidLoginAuthCode,
  SteamUser.EResult.AccountLocked,
  SteamUser.EResult.InvalidItemType
];

let isLoggedIn = false;  // Flag to track login state

// Function to log in to Steam
function loginToSteam() {
  if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    error('Max login attempts reached. Exiting...');
    process.exit(1);
  }

  log(`Attempting to log in to Steam (Attempt ${loginAttempts + 1})...`);
  client.logOn({
    accountName: config.accountName,
    password: config.password,
    twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
  });

  loginAttempts += 1;
}

// Retry with exponential backoff
function handleReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    error('Max reconnect attempts reached. Stopping...');
    process.exit(1); // Exit after max attempts reached
  }

  const delay = Math.pow(2, reconnectAttempts) * 1000; // Exponential backoff: 1s, 2s, 4s, 8s...
  log(`Attempting to reconnect in ${delay / 1000} seconds...`);

  reconnectAttempts++;
  setTimeout(loginToSteam, delay); // Retry login with exponential backoff
}

// Log in to Steam initially
loginToSteam();

// Steam client event handlers
client.on('loggedOn', () => {
  loginAttempts = 0; // Reset on successful login
  isLoggedIn = true;  // Set the login state to true
  log('Steam client logged in and online');
  client.setPersona(SteamUser.EPersonaState.Online);
  client.gamesPlayed([252490]); // Example game ID
});

client.on('error', (err) => {
  error(`Steam client encountered an error: ${err}`);

  // Log error result for debugging
  log(`Error result: ${err.eresult}, Error message: ${err.message}`);

  // Check if the error is a critical error and requires a re-login
  if (criticalErrors.includes(err.eresult)) {
    log('Critical error encountered. Attempting to reconnect...');
    handleReconnect();
  } else {
    log('Non-critical error encountered. No reconnect triggered.');
  }
});

client.on('disconnected', (eresult, msg) => {
  warn(`Disconnected from Steam (${eresult}): ${msg}.`);

  // Log the disconnection reason
  log(`Disconnected due to: ${eresult} - ${msg}`);

  // Only attempt reconnect if the bot is not logged in
  if (!isLoggedIn) {
    log('Bot is not logged in, attempting reconnect.');
    handleReconnect();  // Attempt re-login after exponential backoff
  } else {
    log('Bot is logged in, not reconnecting.');
  }
});

client.on('webSession', (sessionId, cookies) => {
  log('Web session established.');
  manager.setCookies(cookies);
  community.setCookies(cookies);
  community.startConfirmationChecker(20000, config.identitySecret);
});

// Heartbeat to monitor connection status
const HEARTBEAT_INTERVAL = 60000; // 60 seconds

setInterval(() => {
  // Use the 'isLoggedIn' flag to check bot status
  if (!isLoggedIn) {
    warn('Bot is not logged in. Attempting to reconnect...');
    handleReconnect(); // Attempt re-login if not logged in
  } else {
    log('Heartbeat: Bot is online.');
  }
}, HEARTBEAT_INTERVAL);

// Optional: Graceful shutdown handling
process.on('SIGINT', () => {
  log('Received SIGINT. Shutting down gracefully...');
  client.logOff();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM. Shutting down gracefully...');
  client.logOff();
  process.exit(0);
});

module.exports = { manager };


















// const SteamUser = require('steam-user');
// const SteamCommunity = require('steamcommunity');
// const SteamTradeManager = require('steam-tradeoffer-manager');
// const SteamTotp = require('steam-totp');
// const fs = require('fs');

// const client = new SteamUser();
// const community = new SteamCommunity();
// const manager = new SteamTradeManager({
//   steam: client,
//   community: community,
//   language: 'en',
//   useAccessToken: true
// });

// // Steam bot credentials from environment variables
// const config = {
//   accountName: process.env.STEAM_ACCOUNT_NAME,
//   password: process.env.STEAM_PASSWORD,
//   sharedSecret: process.env.STEAM_SHARED_SECRET,
//   identitySecret: process.env.STEAM_IDENTITY_SECRET
// };

// console.log('Config:', config);

// // Validate Steam credentials
// if (!config.accountName || !config.password || !config.sharedSecret || !config.identitySecret) {
//   console.error('Steam credentials are not fully set in environment variables.');
//   process.exit(1);
// }

// // Function to log in to Steam
// function loginToSteam() {
//   client.logOn({
//     accountName: config.accountName,
//     password: config.password,
//     twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
//   });
// }

// // Log in to Steam initially
// loginToSteam();

// client.on('loggedOn', () => {
//   client.setPersona(SteamUser.EPersonaState.Online);
//   client.gamesPlayed([252490]); // Example game ID
//   console.log('Steam client logged in and online');
// });

// // Error handler
// client.on('error', (err) => {
//   console.error('Steam client encountered an error:', err);
//   // Attempt to re-log after error if logged off
//   if (err.eresult === SteamUser.EResult.LoggedOff || err.eresult === SteamUser.EResult.NoConnection) {
//     setTimeout(loginToSteam, 5000); // Try re-logging in after 5 seconds
//   }
// });

// client.on('disconnected', (eresult, msg) => {
//   console.log(`Disconnected from Steam (${eresult}): ${msg}. Attempting to relog.`);
//   setTimeout(loginToSteam, 5000); // Attempt re-login after 5 seconds
// });

// client.on('webSession', (sessionId, cookies) => {
//   console.log('Web session established.');
//   manager.setCookies(cookies);
//   community.setCookies(cookies);
//   community.startConfirmationChecker(20000, config.identitySecret);
// });

// module.exports = { manager };










