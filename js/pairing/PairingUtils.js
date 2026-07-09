class PairingUtils {

    //==========================================
    // Sortowanie PFS
    //==========================================
    static sortPlayers(players) {

        players.sort((a, b) => {

            if (a.dp !== b.dp)
                return b.dp - a.dp;

            if (a.mp !== b.mp)
                return b.mp - a.mp;

            return b.startRank - a.startRank;

        });

        return players;
    }

    //==========================================
    // Grupowanie wg DP
    //==========================================
    static groupPlayers(players) {

        const groups = [];

        let current = [];

        let lastDp = null;

        players.forEach(p => {

            if (lastDp === null || p.dp === lastDp) {

                current.push(p);

            } else {

                groups.push(current);

                current = [p];

            }

            lastDp = p.dp;

        });

        if (current.length)
            groups.push(current);

        return groups;

    }

    //==========================================
    // Czy grali?
    //==========================================
    static hasPlayed(a, b) {

        if (!a.opponents)
            a.opponents = [];

        return a.opponents.includes(b.id);

    }

    //==========================================
    // Dodanie przeciwników
    //==========================================
    static rememberGame(a, b) {

        if (!a.opponents)
            a.opponents = [];

        if (!b.opponents)
            b.opponents = [];

        a.opponents.push(b.id);

        b.opponents.push(a.id);

    }

    //==========================================
    // BYE
    //==========================================
    static assignBye(players) {

        if (players.length % 2 === 0)
            return null;

        // od końca szukamy zawodnika bez bye
        for (let i = players.length - 1; i >= 0; i--) {

            const p = players[i];

            if (!p.bye) {

                players.splice(i, 1);

                p.bye = true;

                return p;

            }

        }

        return players.pop();

    }

    //==========================================
    // Zamiana zawodników
    //==========================================
    static swap(array, i, j) {

        const tmp = array[i];

        array[i] = array[j];

        array[j] = tmp;

    }

    //==========================================
    // Kopia
    //==========================================
    static clone(players) {

        return JSON.parse(JSON.stringify(players));

    }

    //==========================================
    // Walidacja par
    //==========================================
    static validate(games) {

        const ids = new Set();

        for (const g of games) {

            if (ids.has(g.playerA.id))
                return false;

            if (ids.has(g.playerB.id))
                return false;

            ids.add(g.playerA.id);

            ids.add(g.playerB.id);

        }

        return true;

    }

    //==========================================
    // Rozszerzenie grupy 1.5
    //==========================================
    static expandGroups(groups, index) {

        if (index >= groups.length - 1)
            return;

        if (groups[index].length % 2 === 0)
            return;

        if (groups[index + 1].length === 0)
            return;

        groups[index].push(groups[index + 1].shift());

    }

    //==========================================
    // Podział na połowy
    //==========================================
    static split(group) {

        const half = Math.floor(group.length / 2);

        return {

            upper: group.slice(0, half),

            lower: group.slice(half)

        };

    }
    static canPlay(a, b) {

    if (a.id == b.id)
        return false;

    if (this.hasPlayed(a, b))
        return false;

    return true;

}

}