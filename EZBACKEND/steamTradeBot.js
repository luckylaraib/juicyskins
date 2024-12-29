const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const SteamTradeManager = require('steam-tradeoffer-manager');
const SteamTotp = require('steam-totp');
const fs = require('fs');
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'bot.log' })
  ],
});

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
logger.info('Config: Account Name is set.');

// Validate Steam credentials
if (!config.accountName || !config.password || !config.sharedSecret || !config.identitySecret) {
  logger.error('Steam credentials are not fully set in environment variables.');
  process.exit(1);
}

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err}`);
  // Optionally, restart or perform other actions
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
  // Optionally, restart or perform other actions
});

let loginAttempts = 0;
const MAX_LOGIN_ATTEMPTS = 10;

// Function to log in to Steam
function loginToSteam() {
  if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    logger.error('Max login attempts reached. Exiting...');
    process.exit(1);
  }

  logger.info(`Attempting to log in to Steam (Attempt ${loginAttempts + 1})...`);
  client.logOn({
    accountName: config.accountName,
    password: config.password,
    twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
  });

  loginAttempts += 1;
}

// Log in to Steam initially
loginToSteam();

// Steam client event handlers
client.on('loggedOn', () => {
  loginAttempts = 0; // Reset on successful login
  client.setPersona(SteamUser.EPersonaState.Online);
  client.gamesPlayed([252490]); // Example game ID
  logger.info('Steam client logged in and online');
});

client.on('error', (err) => {
  logger.error(`Steam client encountered an error: ${err}`);
  if ([SteamUser.EResult.NotLoggedOn, SteamUser.EResult.NoConnection].includes(err.eresult)) {
    logger.info('Attempting to reconnect in 5 seconds...');
    setTimeout(loginToSteam, 2000); // Try re-logging in after 5 seconds
  } else {
    // Handle other errors or decide to exit
    // process.exit(1); // Uncomment if you want to terminate on certain errors
  }
});

client.on('disconnected', (eresult, msg) => {
  logger.warn(`Disconnected from Steam (${eresult}): ${msg}. Attempting to relog.`);
  setTimeout(loginToSteam, 5000); // Attempt re-login after 5 seconds
});

client.on('loggedOff', (eresult) => {
  logger.warn(`Logged off from Steam (${eresult}). Attempting to relog.`);
  setTimeout(loginToSteam, 5000); // Attempt re-login after 5 seconds
});

client.on('webSession', (sessionId, cookies) => {
  logger.info('Web session established.');
  manager.setCookies(cookies);
  community.setCookies(cookies);
  community.startConfirmationChecker(20000, config.identitySecret);
});

// Heartbeat to monitor connection status
const HEARTBEAT_INTERVAL = 60000; // 60 seconds

setInterval(() => {
  if (!client.steamID || client.steamID.getSteamID64() === '0') {
    logger.warn('Bot is not logged in. Attempting to reconnect...');
    loginToSteam();
  } else {
    logger.info('Heartbeat: Bot is online.');
  }
}, HEARTBEAT_INTERVAL);

// Optional: Graceful shutdown handling
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Shutting down gracefully...');
  client.logOff();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Shutting down gracefully...');
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










