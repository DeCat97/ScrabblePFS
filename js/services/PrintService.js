class PrintService {

    static printPlayers() {

        const tournament = TournamentView.tournament;

        let html = this.header(
            "Lista zawodników",
            tournament
        );

        html += `

<table class="printTable">

<thead>

<tr>

<th>Lp.</th>

<th>Nazwisko</th>

<th>Imię</th>

<th>Miasto</th>

<th>Rank</th>

</tr>

</thead>

<tbody>

`;

        tournament.players
            .sort((a,b)=>{

                if(a.startRank!=b.startRank)
                    return b.startRank-a.startRank;

                return a.lastName.localeCompare(b.lastName);

            })
            .forEach((p,i)=>{

                html+=`

<tr>

<td>${i+1}</td>

<td>${p.lastName}</td>

<td>${p.firstName}</td>

<td>${p.city}</td>

<td>${p.startRank}</td>

</tr>

`;

            });

        html+=`

</tbody>

</table>

`;

        this.print(html);

    }

    static printStandings(){

        const tournament=TournamentView.tournament;

        let players=[...tournament.players];

        players.sort((a,b)=>{

            if(a.dp!=b.dp)
                return b.dp-a.dp;

            if(a.mp!=b.mp)
                return b.mp-a.mp;

            if(a.mpDiff!=b.mpDiff)
                return b.mpDiff-a.mpDiff;

            return b.startRank-a.startRank;

        });

        let html=this.header(
            "Aktualna tabela",
            tournament
        );

        html+=`

<table class="printTable">

<thead>

<tr>

<th>M-ce</th>

<th>Nazwisko</th>

<th>Imię</th>

<th>DP</th>

<th>MP</th>

<th>ΔMP</th>

</tr>

</thead>

<tbody>

`;

        players.forEach((p,i)=>{

            html+=`

<tr>

<td>${i+1}</td>

<td>${p.lastName}</td>

<td>${p.firstName}</td>

<td>${p.dp}</td>

<td>${p.mp}</td>

<td>${p.mpDiff}</td>

</tr>

`;

        });

        html+=`

</tbody>

</table>

`;

        this.print(html);

    }

    static printRound(round){

        let html=this.header(

            "Parowania rundy "+round.number,

            TournamentView.tournament

        );

        html+=RoundCard.render(round);

        this.print(html);

    }

    static printProtocol(round){

        let html=this.header(

            "Protokół rundy "+round.number,

            TournamentView.tournament

        );

        html+=`

<table class="printTable">

<thead>

<tr>

<th>Stół</th>

<th>Zawodnik A</th>

<th>Wynik</th>

<th>Wynik</th>

<th>Zawodnik B</th>

</tr>

</thead>

<tbody>

`;

        round.games.forEach((g,i)=>{

            html+=`

<tr>

<td>${i+1}</td>

<td>${g.playerA.lastName} ${g.playerA.firstName}</td>

<td>______</td>

<td>______</td>

<td>

${g.bye

?"BYE"

:g.playerB.lastName+" "+g.playerB.firstName}

</td>

</tr>

`;

        });

        html+=`

</tbody>

</table>

`;

        this.print(html);

    }

    static header(title,tournament){

        return `

<h1>

${title}

</h1>

<h3>

${tournament.name}

</h3>

<p>

Sędzia:
${tournament.referee}

<br>

Miejsce:
${tournament.place}

<br>

Data:
${tournament.date}

</p>

<hr>

`;

    }

    static print(html){

        const win=window.open("","PRINT");

        win.document.write(`

<html>

<head>

<title>

Druk

</title>

<link
rel="stylesheet"
href="css/style.css">

</head>

<body>

${html}

</body>

</html>

`);

        win.document.close();

        win.focus();

        win.print();

    }

}