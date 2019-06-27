const redisClient = require('../redisClient');
const axios = require('../axiosLoL');
const checkRateLimits = require('../checkRateLimits');

async function getPlayerMatches(accountId, beginIndex = 0, endIndex = 10, region = 'na1') {
    return new Promise((resolve, reject) => {
        // Create our endpoint to the League API feature we will be using, and the connection to our Redis DB.
        const endpoint = `https://${region}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=${endIndex}&beginIndex=${beginIndex}`;
        const client = redisClient();

        client.get(`getPlayerMatches:${accountId}:${region}:${beginIndex}-${endIndex}`, (err, reply) => {
            if (err) {
                reject(err);
                client.end(true);
            } else {
                if (!reply) { // We don't have that user cached. So we will fetch it from the League of Legends API, then put it in our Cache.
                    axios.get(endpoint).then(async res => {
                        // Check rate limits. Delay actions if we are close to hitting rate limits.
                        const checkAPI = await checkRateLimits(res.headers);
                        client.set(`getPlayerMatches:${accountId}:${region}:${beginIndex}-${endIndex}`, JSON.stringify(res.data), 'EX', 1000 * 60 * 60 * 3); // Expires in cache after 3 hours.
                        resolve(res.data);
                        client.end(true);
                    }).catch(error => {
                        reject(error);
                        client.end(true);
                    })
                } else {
                    resolve(JSON.parse(reply));
                    client.end(true);
                }
            }
        });
    });
}

module.exports = getPlayerMatches;