class TournamentPlayer {

    constructor(player) {

        this.id = player.id;

        this.firstName = player.firstName;

        this.lastName = player.lastName;

        this.city = player.city;

        // Ranking obowiązujący na rozpoczęcie turnieju
        this.startRank = player.tournamentRank;

        // Status zawodnika
        // ACTIVE
        // ABSENT
        // WITHDRAWN
        this.status = "ACTIVE";

        // Numer rundy dołączenia do turnieju
        this.joinRound = 1;

        // Numer rundy wycofania
        this.leaveRound = null;
        // Powód wycofania
        this.withdrawReason = "";

        // Nieobecności tylko w wybranych rundach
        this.absentRounds = [];

        // Wyniki rzeczywiste
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

        // Historia przeciwników
        this.opponents = [];

        // Wyrównania PFS
        this.compensationDP = 0;

        this.compensationMP = 0;

        // Oryginalnie przyznane wyrównanie
        this.originalCompensationDP = 0;

        this.originalCompensationMP = 0;

    }

    //==========================================
    // Czy bierze udział w następnym parowaniu
    //==========================================

    isAvailable(roundNumber) {

        if (this.status === "WITHDRAWN")
            return false;

        if (this.status === "ABSENT")
            return false;

        if (this.absentRounds.includes(roundNumber))
            return false;

        return true;

    }

}