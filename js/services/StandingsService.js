class StandingsService {

    //=========================================
    // Przeliczenie całego turnieju
    //=========================================

    static recalculate() {

        const tournament = TournamentService.current();

        if (!tournament)
            return;

        this.resetPlayers(tournament.players);

        tournament.rounds.forEach(round => {

            if (!round.finished)
                return;

            round.games.forEach(game => {

                this.processGame(game);

            });

        });

        this.calculateBuchholz(tournament);

        this.calculateBerger(tournament);

        TournamentService.save(tournament);

    }

    //=========================================
    // Reset statystyk
    //=========================================

    static resetPlayers(players) {

        players.forEach(player => {

            player.dp = 0;

            player.mp = 0;

            player.mpDiff = 0;

            player.games = 0;

            player.wins = 0;

            player.losses = 0;

            player.draws = 0;

            player.byes = 0;

            player.buchholz = 0;

            player.berger = 0;

            player.tournamentScalp = 0;

            player.opponents = [];

        });

    }

    //=========================================
    // Jedna partia
    //=========================================

    static processGame(game) {

        const A = game.playerA;

        if (game.bye) {

            A.dp += 1;

            A.games++;

            A.byes++;

            return;

        }

        const B = game.playerB;

        A.games++;
        B.games++;

        A.mp += game.scoreA;
        B.mp += game.scoreB;

        A.mpDiff += game.scoreA - game.scoreB;
        B.mpDiff += game.scoreB - game.scoreA;

        A.opponents.push(B.id);
        B.opponents.push(A.id);

        if (game.scoreA > game.scoreB) {

            A.dp += 1;

            A.wins++;

            B.losses++;

        }
        else if (game.scoreB > game.scoreA) {

            B.dp += 1;

            B.wins++;

            A.losses++;

        }
        else {

            A.dp += 0.5;
            B.dp += 0.5;

            A.draws++;
            B.draws++;

        }

    }

    //=========================================
    // Buchholz
    //=========================================

    static calculateBuchholz(tournament) {

        tournament.players.forEach(player => {

            let value = 0;

            player.opponents.forEach(id => {

                const opponent =
                    tournament.players.find(
                        p => p.id == id
                    );

                if (opponent)
                    value += opponent.dp;

            });

            player.buchholz = value;

        });

    }

    //=========================================
    // Berger
    //=========================================

    static calculateBerger(tournament) {

        tournament.players.forEach(player => {

            player.berger = 0;

        });

    }

}