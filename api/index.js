const app = require('../util/app');
const { getPlayer, getPlayerMatches, getPlayerMatch } = require('../util/LoLlib');

//Testing getting player matches.
app.get('*', async (req, res) => {
    try {
        let startTime = Date.now(); // benchmarking time
        let player = await getPlayer('MichaeII');
        let matchesForPlayer = await getPlayerMatches(player.accountId);
        player.matchHistory = matchesForPlayer;
        player.matchHistory.matches[0] = await getPlayerMatch(player.matchHistory.matches[0].gameId)
        let endTime = Date.now() // benchmarking time
        console.log((endTime - startTime) / 1000); // benchmarking time
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