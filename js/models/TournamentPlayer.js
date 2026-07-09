class TournamentPlayer {

    constructor(player) {

        this.id = player.id;

        this.firstName = player.firstName;

        this.lastName = player.lastName;

        this.city = player.city;

        // Zamrożony ranking
        this.startRank = player.tournamentRank;

        // Wyniki
        this.dp = 0;

        this.mp = 0;

        this.mpDiff = 0;

        this.games = 0;

        this.wins = 0;

        this.losses = 0;

        this.draws = 0;

        this.byes = 0;

        // Tie-breaki
        this.buchholz = 0;

        this.berger = 0;

        this.tournamentScalp = 0;


        // Status uczestnictwa
        this.active = true;

        this.withdrawRound = null;

        this.withdrawReason = "";

        this.joinRound = 1;

        // Wyrównania PFS
        this.compensationDP = 0;

        this.compensationMP = 0;

        this.originalCompensationDP = 0;

        this.originalCompensationMP = 0;

        // Historia przeciwników
        this.opponents = [];

    }

}