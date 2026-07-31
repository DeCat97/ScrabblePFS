class App {
    static tournamentService = null;

    static currentPage = "dashboard";

    static currentTournament = null;

    static init() {
        App.tournamentService = new TournamentService({
            storageService: new StorageService(),
            standingsService: new StandingsService(),
            compensationService: new CompensationService(),
            pairingService: new PairingService()
        });

        // Storage.init();

        this.initMenu();

        TournamentBrowser.init();

        PlayersView.init();

        RankingView.init();

        this.show("dashboard");

        this.updateDashboard();

    }

    static initMenu() {

        document.querySelectorAll(".menuButton").forEach(btn => {

            btn.onclick = () => {

                document
                    .querySelectorAll(".menuButton")
                    .forEach(b => b.classList.remove("active"));

                btn.classList.add("active");

                this.show(btn.dataset.page);

            };

        });

    }

    static show(page) {

        App.currentPage = page;

        document
            .querySelectorAll(".page")
            .forEach(p => p.classList.add("hidden"));

        document
            .getElementById(page + "Page")
            .classList.remove("hidden");

        switch (page) {

            case "dashboard":

                App.updateDashboard();

                break;

            case "tournaments":

                TournamentBrowser.refresh();

                break;

            case "players":

                PlayersView.refresh();

                break;

            case "ranking":

                RankingView.refresh();

                break;

        }

    }

    static updateDashboard() {

        document.getElementById("dashboardTournamentCount").innerText =
            Storage.getTournaments().length;

        document.getElementById("dashboardPlayerCount").innerText =
            Storage.getPlayers().length;

        let rounds = 0;

        let games = 0;

        Storage.getTournaments().forEach(t => {

            rounds += t.rounds.length;

            t.rounds.forEach(r => games += r.games.length);

        });

        document.getElementById("dashboardRoundCount").innerText = rounds;

        document.getElementById("dashboardGamesCount").innerText = games;

    }

}

window.onload = () => {

    App.init();

}