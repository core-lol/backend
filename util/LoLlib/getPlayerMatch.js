const redisClient = require('../redisClient');
const axios = require('../axiosLoL');
const checkRateLimits = require('../checkRateLimits');

async function getPlayerMatch(matchId, region = 'na1') {
    return new Promise((resolve, reject) => {
        // Create our endpoint to the League API feature we will be using, and the connection to our Redis DB.
        const endpoint = `https://${region}.api.riotgames.com/lol/match/v4/matches/${matchId}`;
        const client = redisClient();

        client.get(`getPlayerMatch:${matchId}:${region}`, (err, reply) => {
            if (err) {
                reject(err);
                client.end(true);
            } else {
                if (!reply) { // We don't have that match cached. So we will fetch it from the League of Legends API, then put it in our Cache.
                    axios.get(endpoint).then(async res => {
                        // Check rate limits. Delay actions if we are close to hitting rate limits.
                        const checkAPI = await checkRateLimits(res.headers);
                        client.set(`getPlayerMatch:${matchId}:${region}`, JSON.stringify(res.data), 'EX', 1000 * 60 * 60 * 24); // Expires in cache after 24 hours.
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

module.exports = getPlayerMatch;