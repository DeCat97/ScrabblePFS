class StandingsView {

    static refresh() {

        const tournaments = Storage.getTournaments();

        const tournament = tournaments.find(
            t => t.id == App.currentTournament
        );

        if (!tournament)
            return;

        const players = [...tournament.players];

        players.sort((a, b) => {

            if (a.dp != b.dp)
                return b.dp - a.dp;

            if (a.mp != b.mp)
                return b.mp - a.mp;

            if (a.mpDiff != b.mpDiff)
                return b.mpDiff - a.mpDiff;

            return b.startRank - a.startRank;

        });

        let html = `

<table class="standingsTable">

<thead>

<tr>

<th>M-ce</th>

<th>Nazwisko</th>

<th>Imię</th>

<th>Miasto</th>

<th>DP</th>

<th>MP</th>

<th>ΔMP</th>

<th>Rank</th>

</tr>

</thead>

<tbody>

`;

        players.forEach((p, i) => {

            html += `

<tr>

<td>${i + 1}</td>

<td>${p.lastName}</td>

<td>${p.firstName}</td>

<td>${p.city}</td>

<td>${p.dp.toFixed(1)}</td>

<td>${p.mp}</td>

<td>${p.mpDiff}</td>

<td>${p.startRank}</td>

</tr>

`;

        });

        html += `

</tbody>

</table>

`;

        document.getElementById("tStandings").innerHTML = html;

    }

}