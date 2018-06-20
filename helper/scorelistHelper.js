function equalsInScore(pScoreA, pScoreB) {
    let ascore = pScoreA.score;
    let bscore = pScoreB.score;
    if (ascore < bscore) {
        return 1;
    }
    if (ascore > bscore) {
        return -1;
    }
    //beide haben den selbsen Score: sortiere User mit weniger gespielten spielen nach oben
    let agames = pScoreA.games;
    let bgames = pScoreB.games;
    if (agames < bgames) {
        return -1;
    }
    if (agames > bgames) {
        return 1;
    }
    return 0;
}

module.exports = {
    equalsInScore
};