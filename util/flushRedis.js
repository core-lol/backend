require('dotenv').config();
const client = require('./redisClient')();

client.flushall('ASYNC', () => {
    console.log('Flushed Redis Database.');
    client.end(true)
});