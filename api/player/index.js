const app = require('../../util/app');
const { getPlayer, getPlayerMatches, getMatch } = require('../../util/LoLlib');

app.get('*', async (req, res) => {
    const { name } = req.query;
    try {
        let startTime = Date.now(); // benchmarking time
        let player = await getPlayer(name);
        let matchesForPlayer = await getPlayerMatches(player.accountId);
        player.matchHistory = matchesForPlayer;
        // Loop through the general game data from the player, and get specific data for each one and put it in the player object.
        for (const [index, match] of player.matchHistory.matches.entries()) {
            player.matchHistory.matches[index] = await getMatch(match.gameId);
        }
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