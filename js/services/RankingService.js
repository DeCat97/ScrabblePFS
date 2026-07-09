class RankingService {

    static calculate(players, games) {

        players.forEach(player => {

            player.gamesPlayed = 0;
            player.scalpSum = 0;

        });

        const today = new Date();

        const twoYearsAgo = new Date(today);

        twoYearsAgo.setFullYear(today.getFullYear() - 2);

        const validGames = games
            .filter(game => {

                const d = new Date(game.date);

                return d >= twoYearsAgo;

            })
            .sort((a, b) => {

                return new Date(b.date) - new Date(a.date);

            })
            .slice(0, 200);

        validGames.forEach(game => {

            const A = players.find(p => p.id == game.playerA);

            const B = players.find(p => p.id == game.playerB);

            if (!A || !B)
                return;

            A.gamesPlayed++;

            B.gamesPlayed++;

            if (game.scoreA > game.scoreB) {

                A.scalpSum += B.rank;

            }
            else if (game.scoreB > game.scoreA) {

                B.scalpSum += A.rank;

            }

        });

        players.forEach(player => {

            if (player.gamesPlayed < 30) {

                player.rank = 100;

                return;

            }

            player.rank = Math.round(

                player.scalpSum /

                player.gamesPlayed

            );

        });

        players.sort((a, b) => {

            return b.rank - a.rank;

        });

        return players;

    }

}