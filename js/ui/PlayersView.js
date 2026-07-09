class PlayersView {

    static selectedId = null;

    static init() {

        document.getElementById("btnNewPlayer").onclick = () => {

            this.clearForm();

            Dialogs.open("playerModal");

        };

        document.getElementById("btnSavePlayer").onclick = () => {

            this.save();

        };

        document.getElementById("btnDeletePlayer").onclick = () => {

            this.remove();

        };
        document.getElementById("btnAddPlayer").onclick = () => {

            this.moveSelected(

                document.getElementById("allPlayers"),

                document.getElementById("tournamentPlayers")

            );

        };

        document.getElementById("btnRemovePlayer").onclick = () => {

            this.moveSelected(

                document.getElementById("tournamentPlayers"),

                document.getElementById("allPlayers")

            );

        };

        document.getElementById("btnAddAllPlayers").onclick = () => {

            const l = document.getElementById("allPlayers");

            const r = document.getElementById("tournamentPlayers");

            while (l.options.length) {

                r.add(l.options[0]);

            }

        };

        document.getElementById("btnRemoveAllPlayers").onclick = () => {

            const l = document.getElementById("allPlayers");

            const r = document.getElementById("tournamentPlayers");

            while (r.options.length) {

                l.add(r.options[0]);

            }

        };
        const search = document.getElementById("playerSearch");

        if (search) {

            search.onkeyup = () => {

                this.filterPlayers();

            };

        }
        document
            .getElementById("btnSaveTournamentPlayers")
            .onclick = () => {

                this.saveTournamentPlayers();

            };

    }

    static refresh() {

        const tbody = document.querySelector("#playerTable tbody");

        tbody.innerHTML = "";

        let players = Storage.getPlayers();

        players.sort((a, b) => {

            if (a.lastName != b.lastName)
                return a.lastName.localeCompare(b.lastName);

            return a.firstName.localeCompare(b.firstName);

        });

        players.forEach(player => {

            const tr = document.createElement("tr");

            tr.innerHTML = `

                <td>${player.lastName}</td>

                <td>${player.firstName}</td>

                <td>${player.city}</td>

                <td>${player.rank}</td>

            `;

            tr.onclick = () => {

                document.querySelectorAll("#playerTable tbody tr")
                    .forEach(r => r.classList.remove("selected"));

                tr.classList.add("selected");

                this.selectedId = player.id;

            };

            tr.ondblclick = () => {

                this.edit(player.id);

            };

            tbody.appendChild(tr);

        });

    }

    static clearForm() {

        document.getElementById("playerLastName").value = "";

        document.getElementById("playerFirstName").value = "";

        document.getElementById("playerCity").value = "";

    }

    static save() {

        let players = Storage.getPlayers();

        const player = {

            id: crypto.randomUUID(),

            lastName:
                document.getElementById("playerLastName").value,

            firstName:
                document.getElementById("playerFirstName").value,

            city:
                document.getElementById("playerCity").value,

            rank: 100,

            scalpSum: 0,

            gamesPlayed: 0

        };

        if (player.lastName == "") {

            alert("Podaj nazwisko.");

            return;

        }

        players.push(player);

        Storage.savePlayers(players);

        Dialogs.close("playerModal");

        this.refresh();

        App.updateDashboard();

    }

    static edit(id) {

        const players = Storage.getPlayers();

        const p = players.find(x => x.id == id);

        if (!p) return;

        document.getElementById("playerLastName").value = p.lastName;

        document.getElementById("playerFirstName").value = p.firstName;

        document.getElementById("playerCity").value = p.city;

        Dialogs.open("playerModal");

        document.getElementById("btnSavePlayer").onclick = () => {

            p.lastName =
                document.getElementById("playerLastName").value;

            p.firstName =
                document.getElementById("playerFirstName").value;

            p.city =
                document.getElementById("playerCity").value;

            Storage.savePlayers(players);

            Dialogs.close("playerModal");

            this.refresh();

        };

    }

    static remove() {

        if (this.selectedId == null) {

            alert("Wybierz zawodnika.");

            return;

        }

        if (!confirm("Usunąć zawodnika?"))
            return;

        let players = Storage.getPlayers();

        players = players.filter(x => x.id != this.selectedId);

        Storage.savePlayers(players);

        this.selectedId = null;

        this.refresh();

        App.updateDashboard();

    }

    // Dodawanie zawodnika do aktualnego turnieju
    static addToTournament() {

        const players = Storage.getPlayers();

        const tournaments = Storage.getTournaments();

        const tournament = tournaments.find(
            t => t.id == App.currentTournament
        );

        if (!tournament) {
            alert("Brak otwartego turnieju.");
            return;
        }

        const modal = document.getElementById("playerModal");

        const body = modal.querySelector(".modal-window");

        let html = `

<h2>Dodaj zawodników</h2>

<table id="selectPlayersTable">

<thead>

<tr>

<th></th>

<th>Nazwisko</th>

<th>Imię</th>

<th>Miasto</th>

<th>Rank</th>

</tr>

</thead>

<tbody>

`;

        players.forEach(p => {

            const exists = tournament.players.find(x => x.id == p.id);

            if (exists)
                return;

            html += `

<tr>

<td>

<input
type="checkbox"
value="${p.id}">

</td>

<td>${p.lastName}</td>

<td>${p.firstName}</td>

<td>${p.city}</td>

<td>${p.rank}</td>

</tr>

`;

        });

        html += `

</tbody>

</table>

<br>

<button id="btnAddSelectedPlayers">

Dodaj zaznaczonych

</button>

<button onclick="Dialogs.close('playerModal')">

Anuluj

</button>

`;

        body.innerHTML = html;

        document
            .getElementById("btnAddSelectedPlayers")
            .onclick = () => {

                document
                    .querySelectorAll(
                        "#selectPlayersTable input:checked"
                    )
                    .forEach(ch => {

                        const player =
                            players.find(
                                p => p.id == ch.value
                            );

                        tournament.players.push({

                            id: player.id,

                            lastName: player.lastName,

                            firstName: player.firstName,

                            city: player.city,

                            startRank: player.rank,

                            dp: 0,

                            mp: 0,

                            mpDiff: 0,

                            tournamentScalp: 0,

                            bye: false,

                            opponents: []

                        });

                    });

                Storage.saveTournaments(tournaments);

                Dialogs.close("playerModal");

                TournamentView.refreshPlayers();

            };

        Dialogs.open("playerModal");

    }
    static openTournamentPlayers() {

        const players = Storage.getPlayers();

        const tournaments = Storage.getTournaments();

        const tournament = tournaments.find(
            t => t.id == App.currentTournament
        );

        const left = document.getElementById("allPlayers");

        const right = document.getElementById("tournamentPlayers");

        left.innerHTML = "";

        right.innerHTML = "";

        players.forEach(p => {

            const option = new Option(
                `${p.lastName} ${p.firstName} (${p.rank})`,
                p.id
            );

            if (tournament.players.find(tp => tp.id == p.id)) {

                right.add(option);

            } else {

                left.add(option);

            }

        });

        Dialogs.open("playerModal");

    }
    static moveSelected(from, to) {

        [...from.selectedOptions].forEach(opt => {

            to.add(opt);

        });

    }
    static filterPlayers() {

        const filter =
            document
                .getElementById("playerSearch")
                .value
                .toLowerCase();

        const select =
            document.getElementById("allPlayers");

        [...select.options].forEach(option => {

            option.style.display =
                option.text.toLowerCase().includes(filter)
                    ? ""
                    : "none";

        });

    }
    static saveTournamentPlayers() {

        const tournaments =
            TournamentService.save(tournament);

        const tournament =
            tournaments.find(
                t => t.id == App.currentTournament
            );

        tournament.players = [];

        const right =
            document.getElementById("tournamentPlayers");

        [...right.options].forEach(opt => {

            const player =
                Storage.getPlayers()
                    .find(p => p.id == opt.value);

          tournament.players.push(

    new TournamentPlayer(player)

);
        });

        Storage.saveTournaments(tournaments);

        Dialogs.close("playerModal");

        TournamentView.refreshPlayers();

    }

}