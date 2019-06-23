const app = require('../util/app');
const { getPlayer } = require('../util/LoLlib');

app.get('*', async (req, res) => {
    console.log(await getPlayer('MichaeII')); // Testing result of getPlayer function.
    res.send('Welcome to the CoreLoL API!');
});

module.exports = app;