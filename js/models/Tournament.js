class Tournament {

    constructor() {

        this.id = crypto.randomUUID();

        this.name = "";

        this.place = "";

        this.referee = "";

        this.date = "";

        this.roundsCount = 0;

        // System każdej rundy
        this.roundSystems = [];

        // Zawodnicy turnieju
        this.players = [];

        // Rundy
        this.rounds = [];

        // Czy turniej został zakończony
        this.finished = false;

        // Ranking obowiązujący na rozpoczęcie turnieju
        this.rankingSnapshotDate = "";

        // Data zakończenia
        this.finishDate = "";
        this.rules = {

            compensation: true,

            removeCompensation: true,

            elimination: false,

            promotedPlaces: 3

        };

    }

}