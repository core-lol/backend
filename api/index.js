const app = require('../util/app');
const { getPlayer, getPlayerMatches } = require('../util/LoLlib');

//Testing getting player matches.
app.get('*', async (req, res) => {
    try {
        let startTime = Date.now();
        let player = await getPlayer('MichaeII');
        let matchesForPlayer = await getPlayerMatches(player.accountId);
        player.matchHistory = matchesForPlayer;
        let endTime = Date.now()
        console.log((endTime - startTime) / 1000);
        res.status(200).json(player);
    } catch (err) {
        console.log(err);
        if (err.customMessage) {
            res.status(err.response.status).json({ error: true, message: err.customMessage });
        } else {
            res.status(500).json({ error: true, message: "Internal server error." });
        }
    }
});

module.exports = app;