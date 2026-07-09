class Player {

    constructor() {

        //=====================================
        // Dane podstawowe
        //=====================================

        this.id = crypto.randomUUID();

        this.firstName = "";

        this.lastName = "";

        this.city = "";

        this.notes = "";

        //=====================================
        // Ranking PFS
        //=====================================

        // Aktualny opublikowany ranking
        this.currentRank = 100;

        // Ranking używany do rozstawienia
        this.tournamentRank = 100;

        // Łączna liczba gier rankingowych
        this.gamesCareer = 0;

        // Liczba gier wykorzystanych
        // do aktualnego rankingu
        this.gamesRanking = 0;

        // Łączna suma skalpów
        this.scalpCareer = 0;

        //=====================================
        // Historia
        //=====================================

        // Historia turniejów
        this.tournaments = [];

        // Historia wszystkich partii
        this.games = [];

        //=====================================
        // Statystyki kariery
        //=====================================

        this.wins = 0;

        this.losses = 0;

        this.draws = 0;

        this.byes = 0;

    }

}