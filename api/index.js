const app = require('../util/app');

app.get('*', (req, res) => {
    res.send('Welcome to the CoreLoL API!');
});

module.exports = app;