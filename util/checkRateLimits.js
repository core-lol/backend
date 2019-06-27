// This function will pause the fetching of data for 1 second if we don't have enough left in our rate limit for the API.
// The function takes the request header object.
function checkRateLimits(headers) {
    return new Promise((resolve, reject) => {
        let primaryAppLimitCurrent = Number(headers['x-app-rate-limit-count'].split(':')[0]);
        let primaryAppLimitMax = Number(headers['x-app-rate-limit'].split(':')[0]);
        let secondaryAppLimitCurrent = Number(headers['x-app-rate-limit-count'].split(',')[1].split(':')[0]);
        let secondaryAppLimitMax = Number(headers['x-app-rate-limit'].split(',')[1].split(':')[0]);

        let primaryMethodLimitCurrent = Number(headers['x-method-rate-limit-count'].split(':')[0]);
        let primaryMethodLimitMax = Number(headers['x-method-rate-limit'].split(':')[0]);

        if(primaryAppLimitMax - primaryAppLimitCurrent <= 1) {
            console.log(`Primary App Limit Hit. Delaying 1 Second. | ${primaryAppLimitCurrent} of ${primaryAppLimitMax}`);
            setTimeout(resolve, 1000);
        } else if(secondaryAppLimitMax - secondaryAppLimitCurrent <= 1) {
            console.log(`Primary App Limit Hit. Delaying 1 Second. | ${secondaryAppLimitCurrent} of ${secondaryAppLimitMax}`);
            setTimeout(resolve, 1000);
        } else if(primaryMethodLimitMax - primaryMethodLimitCurrent <= 1) {
            console.log(`Primary Method Limit Hit. Delaying 1 Second. | ${primaryMethodLimitCurrent} of ${primaryMethodLimitMax}`);
            setTimeout(resolve, 1000);
        } else {
            resolve('');
        }
    });
}

module.exports = checkRateLimits;

// Example headers.
// 'x-app-rate-limit': '20:1,100:120',
// 'x-app-rate-limit-count': '1:1,14:120',
// 'x-method-rate-limit': '2000:60',
// 'x-method-rate-limit-count': '14:60',


// "X-Method-Rate-Limit": "1000:10",
// "Content-Length": "62",
// "X-App-Rate-Limit-Count": "1:1,110:120",
// "X-Rate-Limit-Type": "application",
// "X-Method-Rate-Limit-Count": "1:10",
// "X-App-Rate-Limit": "20:1,100:120",