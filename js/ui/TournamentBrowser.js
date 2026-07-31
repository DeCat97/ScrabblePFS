class TournamentBrowser {

    static selectedId = null;

    static init() {

        document
            .getElementById("btnNewTournament")
            .onclick = () => {

                this.clearForm();
                this.buildRoundSystems();

                Dialogs.open("newTournamentModal");

            };
        document
            .getElementById("tournamentRounds")
            .onchange = () => {

                TournamentBrowser.buildRoundSystems();

            };

        document
            .getElementById("btnSaveTournament")
            .onclick = () => {

                this.save();

            };

        document
            .getElementById("btnDeleteTournament")
            .onclick = () => {

                this.remove();

            };

        document
            .getElementById("btnOpenTournament")
            .onclick = () => {

                this.open();

            };

    }

    static refresh() {

        const tbody =
            document.querySelector("#tournamentTable tbody");

        tbody.innerHTML = "";

        const tournaments =
            Storage.getTournaments();

        tournaments.sort((a, b) =>
            a.name.localeCompare(b.name));

        tournaments.forEach(t => {

            const tr = document.createElement("tr");

            tr.innerHTML = `

                <td>${t.name}</td>

                <td>${t.referee}</td>

                <td>${t.date || ""}</td>

                <td>${t.roundsCount}</td>

            `;

            tr.onclick = () => {

                document
                    .querySelectorAll("#tournamentTable tbody tr")
                    .forEach(r => r.classList.remove("selected"));

                tr.classList.add("selected");

                TournamentBrowser.selectedId = t.id;

            };

            tr.ondblclick = () => {

                TournamentBrowser.selectedId = t.id;

                this.open();

            };

            tbody.appendChild(tr);

        });

    }

    static clearForm() {

        document.getElementById("tournamentName").value = "";
        document.getElementById("tournamentReferee").value = "";
        document.getElementById("tournamentPlace").value = "";
        document.getElementById("tournamentDate").value = "";
        document.getElementById("tournamentRounds").value = 7;

    }

    static save() {

        const tournaments =
            Storage.getTournaments();
        const systems = [];

        for (let i = 1; i <= Number(document.getElementById("tournamentRounds").value); i++) {

            systems.push(
                document.getElementById("roundSystem" + i).value
            );

        }

        const tournament = {

            id: crypto.randomUUID(),

            name:
                document.getElementById("tournamentName").value,

            referee:
                document.getElementById("tournamentReferee").value,

            place:
                document.getElementById("tournamentPlace").value,

            date:
                document.getElementById("tournamentDate").value,

            roundsCount:
                Number(
                    document.getElementById("tournamentRounds").value
                ),
            roundSystems: systems,

            players: [],

            rounds: []

        };

        if (tournament.name.trim() === "") {

            alert("Podaj nazwę turnieju.");

            return;

        }

        tournaments.push(tournament);

        Storage.saveTournaments(tournaments);

        Dialogs.close("newTournamentModal");

        this.refresh();

        App.updateDashboard();

    }

    static remove() {

        if (!this.selectedId) {

            alert("Wybierz turniej.");

            return;

        }

        if (!confirm("Usunąć wybrany turniej?"))
            return;

        let tournaments =
            Storage.getTournaments();

        tournaments =
            tournaments.filter(t => t.id != this.selectedId);

        Storage.saveTournaments(tournaments);

        this.selectedId = null;

        this.refresh();

        App.updateDashboard();

    }

    static open() {

        if (!this.selectedId) {

            alert("Wybierz turniej.");

            return;

        }

        App.currentTournament = this.selectedId;
        const tournament = Storage.getTournaments().find(
            t => t.id === this.selectedId
        );

        if (!tournament) {
            alert("Nie znaleziono turnieju.");
            return;
        }

        App.tournamentService.load(tournament);


        TournamentView.load(this.selectedId);

    }
    static buildRoundSystems() {

        const rounds = Number(
            document.getElementById("tournamentRounds").value
        );

        const div = document.getElementById("roundSystemsContainer");

        div.innerHTML = "";

        const systems = [

            ["HALF", "Połówkowy"],

            ["SWISS", "Szwajcarski"],

            ["DUBOV", "Dubov"],

            ["DANISH", "Duński"]

        ];

        for (let i = 1; i <= rounds; i++) {

            let html = `
            <div class="roundSystemRow">

                <label>

                    Runda ${i}

                </label>

                <select id="roundSystem${i}">
        `;

            systems.forEach(s => {

                html += `
                <option value="${s[0]}">

                    ${s[1]}

                </option>
            `;

            });

            html += `
                </select>

            </div>
        `;

            div.innerHTML += html;

        }

    }

}