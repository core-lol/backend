const redisClient = require('../redisClient');
const checkRateLimits = require('../checkRateLimits');

async function getPlayerMatches(accountId, beginIndex = 0, endIndex = 9, region = 'na1') {
    // return new Promise((resolve, reject) => {
    //     // Create our endpoint to the League API feature we will be using, and the connection to our Redis DB.
    //     const endpoint = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`;
    //     const client = redisClient();
    // });
    return 'a'
}

module.exports = getPlayerMatches;