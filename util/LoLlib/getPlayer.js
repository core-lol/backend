const redisClient = require('../redisClient');
const axios = require('../axiosLoL');
const checkRateLimits = require('../checkRateLimits');

function getPlayer(username, region = 'na1') {
    return new Promise((resolve, reject) => {
        // Create our endpoint to the League API feature we will be using, and the connection to our Redis DB.
        const endpoint = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`
        const client = redisClient();
        // Fetch the player from our Redis DB, and if we find it return it.
        // Otherwise we will fetch it from the League of Legends API, set it in cache, then return it.
        client.get(`getPlayer:${username}:${region}`, (err, reply) => {
            if (err) {
                reject(err);
                client.end(true);
            } else {
                if (!reply) { // We don't have that user cached. So we will fetch it from the League of Legends API, then put it in our Cache.
                    axios.get(endpoint).then(async res => {
                        // Check rate limits. Delay actions if we are close to hitting rate limits.
                        const checkAPI = await checkRateLimits(res.headers);
                        client.set(`getPlayer:${username}:${region}`, JSON.stringify(res.data), 'EX', 1000 * 60 * 60 * 1); // Expires in cache after 1 hour.
                        resolve(res.data);
                        client.end(true);
                    }).catch(error => {
                        reject(error);
                        client.end(true);
                    })
                } else {
                    resolve(JSON.parse(reply))
                    client.end(true);
                }
            }
        });
    });
}

module.exports = getPlayer;