class TournamentView {

    static tournament = null;

    //=========================================
    // Otwórz turniej
    //=========================================


    static load(tournamentId) {
        this.open(tournamentId);
    }

    static open(tournamentId) {

        App.currentTournament = tournamentId;

        this.tournament = TournamentService.current();

        if (!this.tournament) {

            alert("Nie znaleziono turnieju.");

            return;

        }

        this.refresh();

    }

    //=========================================
    // Odśwież cały ekran
    //=========================================

    static refresh() {

        this.tournament = TournamentService.current();

        if (!this.tournament)
            return;

        this.refreshInfo();

        this.refreshPlayers();

        this.refreshRounds();

        this.refreshStandings();

    }

    //=========================================
    // Informacje
    //=========================================

    static refreshInfo() {

        document.getElementById("tvTournamentName").innerText =
            this.tournament.name;

        document.getElementById("tvTournamentReferee").innerText =
            this.tournament.referee;

        document.getElementById("tvTournamentPlace").innerText =
            this.tournament.place;

        document.getElementById("tvTournamentDate").innerText =
            this.tournament.date;

    }

    //=========================================
    // Zawodnicy
    //=========================================

    static refreshPlayers() {

        if (typeof PlayersView !== "undefined") {

            PlayersView.refresh();

        }

    }

    //=========================================
    // Rundy
    //=========================================

    static refreshRounds() {

        const tbody =
            document.querySelector("#roundsTable tbody");

        if (!tbody)
            return;

        tbody.innerHTML = "";

        this.tournament.rounds.forEach(round => {

            const tr = document.createElement("tr");

            tr.className = "roundRow";

            tr.ondblclick = () => {

                RoundView.open(round.number);

            };

            tr.innerHTML = `

<td>${round.number}</td>

<td>${this.systemName(round.system)}</td>

<td>${this.roundStatus(round)}</td>

<td>${round.games.length}</td>

`;

            tbody.appendChild(tr);

        });

    }

    //=========================================
    // Tabela
    //=========================================

    static refreshStandings() {

        if (typeof StandingsView !== "undefined") {

            StandingsView.refresh();

        }

    }

    //=========================================
    // Nazwa systemu
    //=========================================

    static systemName(system) {

        switch (system) {

            case "HALF":
                return "Połówkowy";

            case "SWISS":
                return "Szwajcarski";

            case "DUBOV":
                return "Dubov";

            case "DANISH":
                return "Duński";

        }

        return system;

    }

}