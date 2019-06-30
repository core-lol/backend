const app = require('../../util/app');
const { getMatch } = require('../../util/LoLlib');

app.get('*', async (req, res) => {
    const { matchId, region } = req.query;
    try {
        let startTime = Date.now(); // benchmarking time
        let match = await getMatch(matchId, region || 'na1');
        let endTime = Date.now() // benchmarking time
        console.log((endTime - startTime) / 1000); // benchmarking time
        res.status(200).json(match);
    } catch (err) {
        console.log(err.message);
        if (err.customMessage) {
            res.status(err.response.status).json({ error: true, message: err.customMessage });
        } else {
            res.status(500).json({ error: true, message: "Internal server error." });
        }
    }
});

module.exports = app;