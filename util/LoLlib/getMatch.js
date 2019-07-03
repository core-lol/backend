const redisClient = require('../redisClient');
const axios = require('../axiosLoL');
const formatMatch = require('./formatMatch');

async function getPlayerMatch(matchId, region = 'na1') {
    return new Promise((resolve, reject) => {
        // Create our endpoint to the League API feature we will be using, and the connection to our Redis DB.
        const endpoint = `https://${region}.api.riotgames.com/lol/match/v4/matches/${matchId}`;
        const timelineEndpoint = `https://${region}.api.riotgames.com/lol/match/v4/timelines/by-match/${matchId}`;
        const client = redisClient();

        client.get(`getMatch:${matchId}:${region}`, (err, reply) => {
            if (err) {
                reject(err);
                client.end(true);
            } else {
                if (!reply) { // We don't have that match cached. So we will fetch it from the League of Legends API, then put it in our Cache.
                    let match = null;
                    axios.get(endpoint).then(res => {
                        match = res.data;
                        axios.get(timelineEndpoint).then(result => {
                            match.timeline = result.data;
                            await formatMatch(match); // formatMatch will mutate the match object. No need to re-assign anything.
                            client.set(`getMatch:${matchId}:${region}`, JSON.stringify(match), 'EX', 1000 * 60 * 60 * 24); // Expires in cache after 24 hours.
                            resolve(match);
                            client.end(true);
                        })
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