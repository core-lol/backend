const app = require('../util/app');

app.get('*', async (req, res) => {
    res.status(200).json({ message: "Welcome to the Core LoL Backend API!" });
});

module.exports = app;