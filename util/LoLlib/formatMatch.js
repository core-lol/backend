// This function simply calls all of our format match helper functions in order, then resolves the promise when they are all complete.
// All functions mutate the original match, so no need to re-assign match.
function formatMatch(match) {
    return new Promise(async (resolve, reject) => {
        try {
            await formatMatchParticipants(match);
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
        for (const [index, participant] of match.participants.entries()) {
            participant.player = match.participantIdentities[index].player;
            participant.player.profileIcon = `http://ddragon.leagueoflegends.com/cdn/${process.env.LOL_VER}/img/profileicon/${participant.player.profileIcon}.png`;
        }
        delete match.participantIdentities;
        resolve('');
    });
}

module.exports = formatMatch;