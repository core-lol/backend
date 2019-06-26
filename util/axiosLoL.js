const axios = require('axios');
const axiosLoL = axios.create();

axiosLoL.interceptors.request.use(config => {
    config.headers["X-Riot-Token"] = process.env.RIOT_KEY;
    return config;
}, error => {
    return Promise.reject(error);
  });

axiosLoL.interceptors.response.use(res => {
    return res
}, error => {
    if(error.response.status === 429) {
        console.log('League of Legends API Rate Limit Hit.');
        error.customMessage = "We are under heavy load! Please try again soon.";
    } else if(error.response.status === 500 || error.response.status === 502 || error.response.status === 503 || error.response.status === 504) {
        error.customMessage = "The League of Legends API is currently experiencing issues. Please try again soon.";
    } else if(error.response.status === 404) {
        error.customMessage = "No data found.";
    } else if(error.response.status === 401 || error.response.status === 403) {
        console.error('LEAGUE OF LEGENDS API KEY UNAUTHORIZED');
        error.customMessage = "Internal server error.";
    }

    return Promise.reject(error);
});

module.exports = axiosLoL;