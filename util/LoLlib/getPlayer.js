const redis = require('redis');
const axios = require('axios');

function getPlayer(username, region = "na1") {
    return new Promise((resolve, reject) => {
        // Create our endpoint to the League API feature we will be using, and the connection to our Redis DB.
        const endpoint = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`
        const client = redis.createClient({
            url: process.env.REDIS_URL,
            password: process.env.REDIS_PW,
        });

        // Fetch the player from our Redis DB, and if we find it return it.
        // Otherwise we will fetch it from the League of Legends API, set it in cache, then return it.
        client.get(`getPlayer:${username}:${region}`, (err, reply) => {
            if(err) {
                reject(err);
                client.end(true);
            } else {
                if(reply === null) { // We don't have that user cached. So we will fetch it from the League of Legends API, then put it in our Cache.
                    axios.get(endpoint, { headers: { "X-Riot-Token": process.env.RIOT_KEY } }).then(res => {
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
    })
}

module.exports = getPlayer;