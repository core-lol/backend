// This function simply calls all of our format match helper functions in order, then resolves the promise when they are all complete.
// All functions mutate the original match, so no need to re-assign match.
function formatMatch(match) {
    return new Promise(async (resolve, reject) => {
        try {
            await formatMatchParticipants(match);
            delete match.participantIdentities;
            resolve('');
        } catch(error) {
            console.log(error);
            reject('')
        }
    });
}

// This formats the participants object/array of the match.
function formatMatchParticipants(match) {
    return new Promise(resolve => {
        for(let i = 0; i < match.participants.length; i++) {
            match.participants[i].player = match.participantIdentities[i].player;
        }
        resolve('');
    });
}

module.exports = formatMatch;