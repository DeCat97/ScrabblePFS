/*
 Scrabble Tournament Manager
 Plik: RoundView.js
 Wersja: 0.5.0
*/
class RoundView {

    static currentRound = null;

    static newRound() {

        if (!TournamentService.canCreateRound()) {
            alert("Najpierw zatwierdź poprzednią rundę.");
            return;
        }

        const round = TournamentService.createRound();

        if (!round) {
            alert("Nie udało się utworzyć rundy.");
            return;
        }

        TournamentView.refresh();
        this.open(round.number);
    }

    static open(number) {

        this.currentRound = TournamentService.getRound(number);

        if (!this.currentRound)
            return;

        if (this.currentRound.status === RoundStatus.APPROVED) {
            if (!confirm("Edytujesz zatwierdzoną rundę. Zmiana wpłynie na klasyfikację, ale nie zmieni rozegranych parowań. Kontynuować?")) {
                return;
            }
        }

        const tbody = document.querySelector("#resultsTable tbody");
        tbody.innerHTML = "";

        this.currentRound.games.forEach((g, i) => {

            const playerA = TournamentService.getPlayer(g.playerAId) ?? g.playerA;
            const playerB = TournamentService.getPlayer(g.playerBId) ?? g.playerB;

            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td>${g.table || i + 1}</td>
            <td>${playerA.lastName} ${playerA.firstName}</td>
            <td><input id="a${i}" class="scoreBox" type="number" min="0" value="${g.scoreA ?? ""}"></td>
            <td>${g.bye ? "BYE" : playerB.lastName + " " + playerB.firstName}</td>
            <td>${g.bye ? "-" : `<input id="b${i}" class="scoreBox" type="number" min="0" value="${g.scoreB ?? ""}">`}</td>`;

            tbody.appendChild(tr);
        });

        document.getElementById("btnSaveResults").onclick = () => this.saveResults();

        const approve = document.getElementById("btnApproveRound");
        if (approve) {
            approve.disabled = this.currentRound.status === RoundStatus.APPROVED;
            approve.onclick = () => this.approveRound();
        }

        const reopen = document.getElementById("btnReopenRound");
        if (reopen) {
            reopen.style.display = this.currentRound.status === RoundStatus.APPROVED ? "inline-block" : "none";
            reopen.onclick = () => this.reopenRound();
        }

        Dialogs.open("resultsModal");
    }

    static saveResults() {

        if (!this.currentRound)
            return;

        for (let i = 0; i < this.currentRound.games.length; i++) {

            const game = this.currentRound.games[i];

            const a = document.getElementById("a" + i).value;
            if (a === "") {
                alert("Brak wyniku przy stole " + (i + 1));
                return;
            }

            game.scoreA = Number(a);

            if (!game.bye) {
                const b = document.getElementById("b" + i).value;
                if (b === "") {
                    alert("Brak wyniku przy stole " + (i + 1));
                    return;
                }
                game.scoreB = Number(b);
            }
        }

        this.currentRound.start();

        TournamentService.saveRound(this.currentRound);

        if (this.currentRound.status === RoundStatus.APPROVED) {
            StandingsService.recalculate();
        }

        TournamentView.refresh();

        Dialogs.close("resultsModal");
    }

    static approveRound() {

        if (!this.currentRound.finish()) {
            alert("Nie wszystkie wyniki zostały wpisane.");
            return;
        }

        if (!confirm("Czy zatwierdzić rundę?"))
            return;

        this.currentRound.approve();

        TournamentService.saveRound(this.currentRound);

        StandingsService.recalculate();

        TournamentView.refresh();

        Dialogs.close("resultsModal");
    }

    static reopenRound() {

        if (!confirm("Odblokować rundę do edycji?"))
            return;

        this.currentRound.reopen();

        TournamentService.saveRound(this.currentRound);

        this.open(this.currentRound.number);
    }
}
