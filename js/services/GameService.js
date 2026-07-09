class GameService {

    constructor() {

    }

    //==========================================
    // Walidacja wyniku
    //==========================================

    validate(scoreA, scoreB) {

        if (scoreA === null || scoreB === null)
            return false;

        if (isNaN(scoreA))
            return false;

        if (isNaN(scoreB))
            return false;

        return true;

    }

    //==========================================
    // Aktualizacja wyniku
    //==========================================

    update(game, scoreA, scoreB) {

        if (!this.validate(scoreA, scoreB))
            return false;

        game.scoreA = Number(scoreA);
        game.scoreB = Number(scoreB);

        return true;

    }

    //==========================================
    // Zwycięzca
    //==========================================

    getWinner(game) {

        if (game.bye)
            return game.playerA;

        if (game.scoreA > game.scoreB)
            return game.playerA;

        if (game.scoreB > game.scoreA)
            return game.playerB;

        return null;

    }

    //==========================================
    // Przegrany
    //==========================================

    getLoser(game) {

        if (game.bye)
            return null;

        if (game.scoreA > game.scoreB)
            return game.playerB;

        if (game.scoreB > game.scoreA)
            return game.playerA;

        return null;

    }

    //==========================================
    // Remis
    //==========================================

    isDraw(game) {

        if (game.bye)
            return false;

        return game.scoreA === game.scoreB;

    }

    //==========================================
    // BYE
    //==========================================

    isBye(game) {

        return game.bye === true;

    }

}