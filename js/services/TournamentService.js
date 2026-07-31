class TournamentService {

    constructor({
        storageService,
        standingsService,
        compensationService,
        pairingService
    }) {

        this.storage = storageService;
        this.standings = standingsService;
        this.compensation = compensationService;
        this.pairing = pairingService;

        this.tournament = null;

    }

    //==================================================
    // Załadowanie turnieju
    //==================================================

    load(tournament) {

        this.tournament = tournament;

        return this.tournament;

    }

    //==================================================
    // Aktualny turniej
    //==================================================

    getTournament() {

        return this.tournament;

    }

    //==================================================
    // Utworzenie nowego turnieju
    //==================================================

    createTournament(data) {

        const tournament = new Tournament();

        tournament.name = data.name || "";
        tournament.place = data.place || "";
        tournament.startDate = data.startDate || "";
        tournament.endDate = data.endDate || "";
        tournament.roundsCount = data.roundsCount || 0;
        tournament.status = "CREATED";

        tournament.players = [];
        tournament.rounds = [];

        this.tournament = tournament;

        this.save();

        return tournament;

    }

    //==================================================
    // Zapis turnieju
    //==================================================

    save() {

        if (!this.tournament)
            return;

        if (this.storage && this.storage.saveTournament)
            this.storage.saveTournament(this.tournament);

    }

    //==================================================
    // Czy turniej istnieje
    //==================================================

    hasTournament() {

        return this.tournament !== null;

    }

    //==================================================
    // Czy turniej rozpoczęty
    //==================================================

    isStarted() {

        if (!this.tournament)
            return false;

        return this.tournament.rounds.length > 0;

    }

    //==================================================
    // Czy turniej zakończony
    //==================================================

    isFinished() {

        if (!this.tournament)
            return false;

        return this.tournament.status === "FINISHED";

    }

    //==================================================
    // Zamknięcie turnieju
    //==================================================

    finishTournament() {

        if (!this.tournament)
            return false;

        this.tournament.status = "FINISHED";

        this.save();

        return true;

    }
    //==================================================
    // Lista zawodników
    //==================================================

    getPlayers() {

        if (!this.tournament)
            return [];

        return this.tournament.players;

    }

    //==================================================
    // Zawodnik po ID
    //==================================================

    getPlayer(id) {

        if (!this.tournament)
            return null;

        return this.tournament.players.find(
            p => p.id === id
        ) || null;

    }

    //==================================================
    // Dodanie zawodnika
    //==================================================

    addPlayer(player) {

        if (!this.tournament)
            return false;

        if (this.isStarted())
            return false;

        this.tournament.players.push(
            new TournamentPlayer(player)
        );

        this.save();

        return true;

    }

    //==================================================
    // Edycja zawodnika
    //==================================================

    updatePlayer(player) {

        const p = this.getPlayer(player.id);

        if (!p)
            return false;

        p.firstName = player.firstName;
        p.lastName = player.lastName;
        p.city = player.city;
        p.startRank = player.startRank;

        this.save();

        return true;

    }

    //==================================================
    // Usunięcie zawodnika
    //==================================================

    removePlayer(id) {

        if (!this.tournament)
            return false;

        if (this.isStarted())
            return false;

        this.tournament.players =
            this.tournament.players.filter(
                p => p.id !== id
            );

        this.save();

        return true;

    }

    //==================================================
    // Wycofanie zawodnika
    //==================================================

    withdrawPlayer(id, reason = "") {

        const player = this.getPlayer(id);

        if (!player)
            return false;

        player.status = PlayerStatus.WITHDRAWN;

        player.leaveRound =
            this.tournament.rounds.length;

        player.withdrawReason = reason;

        this.save();

        return true;

    }

    //==================================================
    // Przywrócenie zawodnika
    //==================================================

    restorePlayer(id) {

        const player = this.getPlayer(id);

        if (!player)
            return false;

        player.status = PlayerStatus.ACTIVE;

        player.leaveRound = null;

        player.withdrawReason = "";

        this.save();

        return true;

    }

    //==================================================
    // Nieobecność w rundzie
    //==================================================

    markAbsent(id, roundNumber) {

        const player = this.getPlayer(id);

        if (!player)
            return false;

        if (!player.absentRounds.includes(roundNumber))
            player.absentRounds.push(roundNumber);

        this.save();

        return true;

    }

    //==================================================
    // Dopisanie zawodnika
    //==================================================

    addLatePlayer(playerData) {

        const player =
            new TournamentPlayer(playerData);

        player.joinRound =
            this.tournament.rounds.length + 1;

        player.status =
            PlayerStatus.ACTIVE;

        this.compensation.assignCompensation(
            this.tournament,
            player
        );

        this.tournament.players.push(player);

        this.save();

        return player;

    }

    //==================================================
    // Aktywni zawodnicy
    //==================================================

    getActivePlayers(roundNumber) {

        return this.tournament.players.filter(player => {

            if (player.status !== PlayerStatus.ACTIVE)
                return false;

            if (player.joinRound > roundNumber)
                return false;

            if (player.absentRounds.includes(roundNumber))
                return false;

            return true;

        });

    }    //==================================================
    // Lista rund
    //==================================================

    getRounds() {

        if (!this.tournament)
            return [];

        return this.tournament.rounds;

    }

    //==================================================
    // Runda po numerze
    //==================================================

    getRound(number) {

        if (!this.tournament)
            return null;

        return this.tournament.rounds.find(
            r => r.number === number
        ) || null;

    }

    //==================================================
    // Czy można utworzyć następną rundę
    //==================================================

    canCreateRound() {

        if (!this.tournament)
            return false;

        if (this.tournament.rounds.length === 0)
            return true;

        const lastRound =
            this.tournament.rounds[
            this.tournament.rounds.length - 1
            ];

        return lastRound.status === "APPROVED";

    }

    //==================================================
    // Tworzenie rundy
    //==================================================

    createRound(system) {

        if (!this.canCreateRound())
            return null;

        const round = new Round();

        round.number =
            this.tournament.rounds.length + 1;

        round.system = system;

        const players =
            this.getActivePlayers(round.number);

        round.games =
            this.pairing.create(
                system,
                players,
                this.tournament
            );

        this.tournament.rounds.push(round);

        if (this.tournament.status === "CREATED")
            this.tournament.status = "RUNNING";

        this.save();

        return round;

    }

    //==================================================
    // Usunięcie ostatniej rundy
    //==================================================

    deleteLastRound() {

        if (!this.tournament)
            return false;

        if (this.tournament.rounds.length === 0)
            return false;

        const last =
            this.tournament.rounds[
            this.tournament.rounds.length - 1
            ];

        if (last.status === "APPROVED")
            return false;

        this.tournament.rounds.pop();

        this.save();

        return true;

    }

    //==================================================
    // Zatwierdzenie rundy
    //==================================================

    approveRound(number, user = "Sędzia") {

        const round =
            this.getRound(number);

        if (!round)
            return false;

        if (!round.approve(user))
            return false;

        this.recalculate(number);

        this.save();

        return true;

    }

    //==================================================
    // Ponowne otwarcie rundy
    //==================================================

    reopenRound(number) {

        const round =
            this.getRound(number);

        if (!round)
            return false;

        round.reopen();

        this.save();

        return true;

    }

    //==================================================
    // Czy można edytować rundę
    //==================================================

    canEditRound(number) {

        const round =
            this.getRound(number);

        if (!round)
            return false;

        return !round.isApproved();

    }

    //==================================================
    // Aktualna runda
    //==================================================

    getCurrentRound() {

        if (!this.tournament)
            return null;

        if (this.tournament.rounds.length === 0)
            return null;

        return this.tournament.rounds[
            this.tournament.rounds.length - 1
        ];

    }
    //==================================================
    // Aktualizacja wyniku partii
    //==================================================

    updateGame(roundNumber, tableNumber, scoreA, scoreB) {

        const round = this.getRound(roundNumber);

        if (!round)
            return false;

        const game = round.games.find(
            g => g.table === tableNumber
        );

        if (!game)
            return false;

        game.scoreA = scoreA;
        game.scoreB = scoreB;

        // rozpoczęcie rundy
        if (round.status === "NEW")
            round.start();

        // jeśli wszystkie wyniki wpisane
        if (round.isComplete())
            round.finish();

        this.save();

        return true;

    }

    //==================================================
    // Wynik pojedynczej partii
    //==================================================

    getGame(roundNumber, tableNumber) {

        const round = this.getRound(roundNumber);

        if (!round)
            return null;

        return round.games.find(
            g => g.table === tableNumber
        ) || null;

    }

    //==================================================
    // Aktualizacja wielu wyników
    //==================================================

    updateGames(roundNumber, games) {

        const round = this.getRound(roundNumber);

        if (!round)
            return false;

        for (const result of games) {

            const game = round.games.find(
                g => g.table === result.table
            );

            if (!game)
                continue;

            game.scoreA = result.scoreA;
            game.scoreB = result.scoreB;

        }

        if (round.status === "NEW")
            round.start();

        if (round.isComplete())
            round.finish();

        this.save();

        return true;

    }

    //==================================================
    // Przeliczenie klasyfikacji
    //==================================================

    recalculate(fromRound = 1) {

        if (!this.standings)
            return;

        this.standings.recalculate(
            this.tournament,
            fromRound
        );

        this.save();

    }

    //==================================================
    // Czy wszystkie rundy zatwierdzone
    //==================================================

    allRoundsApproved() {

        if (!this.tournament)
            return false;

        if (this.tournament.rounds.length === 0)
            return false;

        return this.tournament.rounds.filter(
            r => r.status === "APPROVED"
        );

    }

    //==================================================
    // Liczba rozegranych rund
    //==================================================

    getPlayedRounds() {

        if (!this.tournament)
            return 0;

        return this.tournament.rounds.filter(
            r => r.status === "APPROVED"
        ).length;
    }

    //==================================================
    // Liczba aktywnych zawodników
    //==================================================

    getActivePlayersCount(roundNumber) {

        return this.getActivePlayers(
            roundNumber
        ).length;

    }    //==================================================
    // Czy można dodać zawodnika
    //==================================================

    canAddPlayer() {

        if (!this.tournament)
            return false;

        return this.tournament.status === "CREATED";

    }

    //==================================================
    // Czy można usunąć zawodnika
    //==================================================

    canRemovePlayer() {

        if (!this.tournament)
            return false;

        return this.tournament.status === "CREATED";

    }

    //==================================================
    // Czy można wycofać zawodnika
    //==================================================

    canWithdrawPlayer(playerId) {

        const player = this.getPlayer(playerId);

        if (!player)
            return false;

        return player.status === PlayerStatus.ACTIVE;

    }

    //==================================================
    // Czy można przywrócić zawodnika
    //==================================================

    canRestorePlayer(playerId) {

        const player = this.getPlayer(playerId);

        if (!player)
            return false;

        return player.status === PlayerStatus.WITHDRAWN;

    }

    //==================================================
    // Czy można oznaczyć jako nieobecnego
    //==================================================

    canMarkAbsent(playerId, roundNumber) {

        const player = this.getPlayer(playerId);

        if (!player)
            return false;

        if (player.status !== PlayerStatus.ACTIVE)
            return false;

        if (player.absentRounds.includes(roundNumber))
            return false;

        return true;

    }

    //==================================================
    // Czy można zakończyć turniej
    //==================================================

    canFinishTournament() {

        if (!this.tournament)
            return false;

        if (this.tournament.rounds.length === 0)
            return false;

        return this.allRoundsApproved();

    }

    //==================================================
    // Liczba zawodników
    //==================================================

    getPlayersCount() {

        if (!this.tournament)
            return 0;

        return this.tournament.players.length;

    }

    //==================================================
    // Liczba aktywnych zawodników
    //==================================================

    getActivePlayersNumber(roundNumber) {

        return this.getActivePlayers(roundNumber).length;

    }

    //==================================================
    // Liczba wycofanych zawodników
    //==================================================

    getWithdrawnPlayersCount() {

        if (!this.tournament)
            return 0;

        return this.tournament.players.filter(
            p => p.status === PlayerStatus.WITHDRAWN
        ).length;

    }

    //==================================================
    // Liczba nieobecnych
    //==================================================

    getAbsentPlayersCount(roundNumber) {

        if (!this.tournament)
            return 0;

        return this.tournament.players.filter(player => {

            if (player.status !== PlayerStatus.ACTIVE)
                return false;

            return player.absentRounds.includes(roundNumber);

        }).length;

    }

    //==================================================
    // Reset turnieju
    //==================================================

    resetTournament() {

        if (!this.tournament)
            return false;

        this.tournament.rounds = [];

        this.tournament.status = "CREATED";

        for (const player of this.tournament.players) {

            player.status = PlayerStatus.ACTIVE;

            player.leaveRound = null;

            player.withdrawReason = "";

            player.absentRounds = [];

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

            player.compensationDP = 0;
            player.compensationMP = 0;

            player.originalCompensationDP = 0;
            player.originalCompensationMP = 0;

            player.opponents = [];

        }

        this.save();

        return true;

    }    //==================================================
    // Czy istnieje zawodnik
    //==================================================

    hasPlayer(id) {

        return this.getPlayer(id) !== null;

    }

    //==================================================
    // Czy istnieje runda
    //==================================================

    hasRound(number) {

        return this.getRound(number) !== null;

    }

    //==================================================
    // Ostatnia runda
    //==================================================

    getLastRound() {

        if (!this.tournament)
            return null;

        if (this.tournament.rounds.length === 0)
            return null;

        return this.tournament.rounds[
            this.tournament.rounds.length - 1
        ];

    }

    //==================================================
    // Numer następnej rundy
    //==================================================

    getNextRoundNumber() {

        if (!this.tournament)
            return 1;

        return this.tournament.rounds.length + 1;

    }

    //==================================================
    // Czy istnieją niezatwierdzone rundy
    //==================================================

    hasOpenRounds() {

        if (!this.tournament)
            return false;

       return this.tournament.rounds.some(
    round => round.status !== "APPROVED"
);

    }

    //==================================================
    // Dane dla wydruków
    //==================================================

    getPrintData() {

        return {

            tournament: this.tournament,

            players: this.getPlayers(),

            rounds: this.getRounds()

        };

    }

    //==================================================
    // Dane klasyfikacji
    //==================================================

    getStandings() {

        if (!this.standings)
            return [];

        return this.standings.getStandings(
            this.tournament
        );

    }

    //==================================================
    // Zapis i przeliczenie
    //==================================================

    refresh(fromRound = 1) {

        this.recalculate(fromRound);

        this.save();

    }

    //==================================================
    // Zapis bez przeliczania
    //==================================================

    commit() {

        this.save();

    }

    //==================================================
    // Usunięcie całego turnieju z pamięci
    //==================================================

    unload() {

        this.tournament = null;

    }

}