const redis = require('redis');

// Every time the client is needed in a lambda function, it needs to be a new instance of said client.
// This way we aren't creating/closing/recreating the same client over and over.
function client() {
    return redis.createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PW,
    });
}

module.exports = client;