class CompensationService {

    constructor(standingsService) {

        this.standingsService = standingsService;

    }

    //==================================================
    // Przyznanie wyrównania nowemu zawodnikowi
    //==================================================

    assignCompensation(tournament, player) {

        const standings =
            this.standingsService.getStandings(tournament);

        const position =
            this.calculateJoinPosition(
                tournament,
                player,
                standings
            );

        const reference =
            this.getReferencePlayer(
                standings,
                position
            );

        if (!reference) {

            player.compensation = {

                dp: 0,
                mp: 0,

                originalDP: 0,
                originalMP: 0,

                round: tournament.rounds.length,

                reason: "Late join"

            };

            return;

        }

        player.compensation = {

            dp: reference.dp,

            mp: reference.mp + 1,

            originalDP: reference.dp,

            originalMP: reference.mp + 1,

            round: tournament.rounds.length,

            reason: "Late join"

        };

    }

    //==================================================
    // Powrót zawodnika
    //==================================================

    restorePlayer(tournament, player) {

        this.assignCompensation(
            tournament,
            player
        );

        player.status = PlayerStatus.ACTIVE;

    }

    //==================================================
    // Wyzerowanie wyrównania
    //==================================================

    clearCompensation(player) {

        player.compensation = {

            dp: 0,

            mp: 0,

            originalDP: 0,

            originalMP: 0,

            round: null,

            reason: ""

        };

    }    //==================================================
    // Pozycja dopisywanego zawodnika
    //==================================================

    calculateJoinPosition(
        tournament,
        player,
        standings
    ) {

        const players =
            tournament.players
                .filter(p => p.status === PlayerStatus.ACTIVE)
                .slice();

        players.push(player);

        players.sort((a, b) => {

            if (a.startRank !== b.startRank)
                return b.startRank - a.startRank;

            return a.lastName.localeCompare(b.lastName);

        });

        return players.findIndex(
            p => p.id === player.id
        );

    }

    //==================================================
    // Zawodnik referencyjny
    //==================================================

    getReferencePlayer(
        standings,
        position
    ) {

        if (standings.length === 0)
            return null;

        if (position < standings.length)
            return standings[position];

        return standings[
            standings.length - 1
        ];

    }

    //==================================================
    // Częściowe usunięcie wyrównania
    //==================================================

    removeCompensation(
        tournament,
        promotedPlaces = 3
    ) {

        const standings =
            this.standingsService.getStandings(
                tournament
            );

        if (standings.length <= promotedPlaces)
            return;

        const border =
            standings[promotedPlaces - 1];

        const borderDP = border.dp;
        const borderMP = border.mp;

        for (const player of standings) {

            if (!player.compensation)
                continue;

            if (player.compensation.dp === 0 &&
                player.compensation.mp === 0)
                continue;

            const diffDP =
                player.dp - borderDP;

            const diffMP =
                player.mp - borderMP;

            if (diffDP < 2)
                continue;

            if (diffDP === 2 &&
                diffMP < 400)
                continue;

            const removeDP =
                Math.min(
                    player.compensation.dp,
                    diffDP - 2
                );

            player.compensation.dp -= removeDP;

            if (removeDP === 0) {

                const removeMP =
                    Math.min(
                        player.compensation.mp,
                        diffMP - 400
                    );

                if (removeMP > 0)
                    player.compensation.mp -= removeMP;

            }

        }

    }    //==================================================
    // Całkowite usunięcie wyrównań
    //==================================================

    clearAllCompensations(tournament) {

        for (const player of tournament.players) {

            this.clearCompensation(player);

        }

    }

    //==================================================
    // Obliczenie wyrównania zawodnika wracającego
    //==================================================

    calculateReturnCompensation(
        tournament,
        player,
        lastPosition,
        rankingPosition,
        roundsPlayed,
        missedRounds
    ) {

        /*
            A - miejsce zajmowane przed wycofaniem

            B - miejsce wynikające z rankingu

            N - liczba rozegranych rund

            M - liczba opuszczonych rund
        */

        const position =
            Math.min(
                lastPosition + missedRounds,
                rankingPosition
            );

        const standings =
            this.standingsService.getStandings(
                tournament
            );

        const reference =
            this.getReferencePlayer(
                standings,
                position
            );

        if (!reference) {

            this.clearCompensation(player);

            return;

        }

        player.compensation.dp =
            reference.dp;

        player.compensation.mp =
            reference.mp + 1;

        player.compensation.originalDP =
            player.compensation.dp;

        player.compensation.originalMP =
            player.compensation.mp;

        player.compensation.round =
            tournament.rounds.length;

        player.compensation.reason =
            "Return";

    }

    //==================================================
    // Usunięcie części wyrównania
    //==================================================

    removePart(player, dp, mp) {

        player.compensation.dp =
            Math.max(
                0,
                player.compensation.dp - dp
            );

        player.compensation.mp =
            Math.max(
                0,
                player.compensation.mp - mp
            );

    }

    //==================================================
    // Czy zawodnik posiada wyrównanie
    //==================================================

    hasCompensation(player) {

        if (!player.compensation)
            return false;

        return player.compensation.dp !== 0 ||
               player.compensation.mp !== 0;

    }

    //==================================================
    // Efektywne DP
    //==================================================

    getDP(player) {

        return player.dp +
               player.compensation.dp;

    }

    //==================================================
    // Efektywne MP
    //==================================================

    getMP(player) {

        return player.mp +
               player.compensation.mp;

    }

}
