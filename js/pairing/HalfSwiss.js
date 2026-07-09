class HalfSwiss {

    static generate(players) {

        let work = PairingUtils.clone(players);

        PairingUtils.sortPlayers(work);

        const bye = PairingUtils.assignBye(work);

        let groups = PairingUtils.groupPlayers(work);

        groups = PairingUtils.balanceGroups(groups);

        let games = [];

        for (let i = 0; i < groups.length; i++) {

            const result = this.pairGroup(groups, i);

            if (result == null)
                return null;

            games.push(...result);

        }

        if (bye != null) {

            games.push({

                table: games.length + 1,

                bye: true,

                playerA: bye,

                playerB: null,

                scoreA: 0,

                scoreB: 0

            });

        }

        games.forEach((g, i) => g.table = i + 1);

        return games;

    }

    //======================================================
    // Parowanie grupy
    //======================================================

    static pairGroup(groups, groupIndex) {

        const group = groups[groupIndex];

        if (group.length == 0)
            return [];

        const split = PairingUtils.split(group);

        const upper = split.upper;

        const lower = split.lower;

        const used = new Array(lower.length).fill(false);

        const games = [];

        const ok = this.search(

            0,

            upper,

            lower,

            used,

            games

        );

        if (ok)
            return games;

        return this.expandAndRetry(

            groups,

            groupIndex

        );

    }

    //======================================================
    // Rekurencja
    //======================================================

    static search(

        upperIndex,

        upper,

        lower,

        used,

        games

    ) {

        if (upperIndex >= upper.length)
            return true;

        const A = upper[upperIndex];

        for (

            let i = 0;

            i < lower.length;

            i++

        ) {

            if (used[i])
                continue;

            const B = lower[i];

            if (!PairingUtils.canPlay(A, B))
                continue;

            used[i] = true;

            games.push({

                playerA: A,

                playerB: B,

                scoreA: 0,

                scoreB: 0

            });

            if (

                this.search(

                    upperIndex + 1,

                    upper,

                    lower,

                    used,

                    games

                )

            )

                return true;

            games.pop();

            used[i] = false;

        }

        return false;

    }
    //======================================================
    // Rozszerzenie grupy
    //======================================================

    static expandAndRetry(groups, groupIndex) {

        if (groupIndex >= groups.length - 1)
            return null;

        const current = groups[groupIndex];

        const next = groups[groupIndex + 1];

        if (next.length == 0)
            return null;

        for (let i = 0; i < next.length; i++) {

            const copy = PairingUtils.clone(groups);

            copy[groupIndex].push(copy[groupIndex + 1][i]);

            copy[groupIndex + 1].splice(i, 1);

            const games = [];

            let ok = true;

            for (let g = groupIndex; g < copy.length; g++) {

                if (copy[g].length == 0)
                    continue;

                if (copy[g].length % 2 == 1) {

                    ok = false;

                    break;

                }

                const result = this.simplePair(copy[g]);

                if (result == null) {

                    ok = false;

                    break;

                }

                games.push(...result);

            }

            if (ok)
                return games;

        }

        return null;

    }

    //======================================================
    // Parowanie jednej grupy
    //======================================================

    static simplePair(group) {

        const split = PairingUtils.split(group);

        const upper = split.upper;

        const lower = split.lower;

        const used = new Array(lower.length).fill(false);

        const games = [];

        const ok = this.search(

            0,

            upper,

            lower,

            used,

            games

        );

        if (!ok)
            return null;

        return games;

    }

    //======================================================
    // Sprawdzenie grup
    //======================================================

    static validateGroups(groups) {

        for (const group of groups) {

            if (group.length % 2 == 1)
                return false;

        }

        return true;

    }

    //======================================================
    // Numeracja stołów
    //======================================================

    static renumber(games) {

        games.forEach((g, i) => {

            g.table = i + 1;

        });

    }

    //======================================================
    // Debug
    //======================================================

    static printGroups(groups) {

        console.log("GRUPY");

        groups.forEach((g, i) => {

            console.log(

                "DP:",

                g.length ? g[0].dp : "-"

            );

            g.forEach(p => {

                console.log(

                    p.lastName,

                    p.firstName

                );

            });

        });

    }
        //======================================================
    // Rekurencyjne parowanie grup
    //======================================================

    static pairAllGroups(groups, index = 0, games = []) {

        if (index >= groups.length)
            return games;

        if (groups[index].length == 0)
            return this.pairAllGroups(groups, index + 1, games);

        if (groups[index].length % 2 != 0)
            return null;

        const local = this.simplePair(groups[index]);

        if (local == null) {

            return this.movePlayer(groups, index, games);

        }

        return this.pairAllGroups(

            groups,

            index + 1,

            games.concat(local)

        );

    }

    //======================================================
    // Przeniesienie zawodnika do grupy wyżej
    //======================================================

    static movePlayer(groups, groupIndex, games) {

        if (groupIndex >= groups.length - 1)
            return null;

        const next = groups[groupIndex + 1];

        if (next.length == 0)
            return null;

        for (let i = 0; i < next.length; i++) {

            const copy = PairingUtils.clone(groups);

            const player = copy[groupIndex + 1].splice(i, 1)[0];

            copy[groupIndex].push(player);

            PairingUtils.sortPlayers(copy[groupIndex]);

            if (!this.validateGroups(copy))
                continue;

            const result = this.pairAllGroups(

                copy,

                groupIndex,

                games

            );

            if (result != null)
                return result;

        }

        return null;

    }

    //======================================================
    // Końcowe numerowanie
    //======================================================

    static finish(games) {

        games.forEach((g, i) => {

            g.table = i + 1;

        });

        return games;

    }

    //======================================================
    // Sprawdzenie poprawności
    //======================================================

    static verify(games) {

        const ids = [];

        for (const g of games) {

            if (g.bye)
                continue;

            if (ids.includes(g.playerA.id))
                return false;

            if (ids.includes(g.playerB.id))
                return false;

            ids.push(g.playerA.id);

            ids.push(g.playerB.id);

        }

        return true;

    }

    //======================================================
    // Test
    //======================================================

    static selfTest(players) {

        const games = this.generate(players);

        console.table(games);

        return games;

    }
        //======================================================
    // Główne wyszukiwanie rozwiązania dla grupy
    //======================================================

    static solveGroup(group){

        const split = PairingUtils.split(group);

        const upper = split.upper;

        const lower = split.lower;

        const used = new Array(lower.length).fill(false);

        const games = [];

        if(this.solveRecursive(
            upper,
            lower,
            used,
            0,
            games
        )){
            return games;
        }

        return null;

    }

    //======================================================
    // Rekurencyjne wyszukiwanie
    //======================================================

    static solveRecursive(
        upper,
        lower,
        used,
        index,
        games
    ){

        if(index==upper.length)
            return true;

        const playerA = upper[index];

        const candidates=[];

        for(let i=0;i<lower.length;i++){

            if(used[i])
                continue;

            const playerB=lower[i];

            if(!PairingUtils.canPlay(playerA,playerB))
                continue;

            candidates.push({

                index:i,

                player:playerB

            });

        }

        candidates.sort((a,b)=>{

            if(a.player.dp!=b.player.dp)
                return b.player.dp-a.player.dp;

            if(a.player.mp!=b.player.mp)
                return b.player.mp-a.player.mp;

            return b.player.startRank-a.player.startRank;

        });

        for(const candidate of candidates){

            used[candidate.index]=true;

            games.push({

                table:0,

                playerA:playerA,

                playerB:candidate.player,

                scoreA:0,

                scoreB:0,

                bye:false

            });

            if(this.solveRecursive(

                upper,

                lower,

                used,

                index+1,

                games

            ))

                return true;

            games.pop();

            used[candidate.index]=false;

        }

        return false;

    }

    //======================================================
    // Liczenie konfliktów
    //======================================================

    static countConflicts(group){

        let conflicts=0;

        for(let i=0;i<group.length;i++){

            for(let j=i+1;j<group.length;j++){

                if(
                    PairingUtils.hasPlayed(
                        group[i],
                        group[j]
                    )
                ){
                    conflicts++;
                }

            }

        }

        return conflicts;

    }

    //======================================================
    // Czy grupa jest trudna?
    //======================================================

    static isHardGroup(group){

        return this.countConflicts(group)>0;

    }

    //======================================================
    // Sortowanie grup wg trudności
    //======================================================

    static sortGroups(groups){

        groups.sort((a,b)=>{

            return this.countConflicts(b)
                -
                this.countConflicts(a);

        });

        return groups;

    }
        //======================================================
    // Przeniesienie zawodnika z następnej grupy
    //======================================================

    static borrowPlayer(groups, groupIndex) {

        if (groupIndex >= groups.length - 1)
            return false;

        const current = groups[groupIndex];
        const next = groups[groupIndex + 1];

        if (next.length == 0)
            return false;

        PairingUtils.sortPlayers(next);

        const player = next.shift();

        current.push(player);

        PairingUtils.sortPlayers(current);

        return true;

    }

    //======================================================
    // Oddanie zawodnika do następnej grupy
    //======================================================

    static returnPlayer(groups, groupIndex) {

        if (groupIndex >= groups.length - 1)
            return;

        const current = groups[groupIndex];
        const next = groups[groupIndex + 1];

        PairingUtils.sortPlayers(current);

        const player = current.pop();

        next.unshift(player);

        PairingUtils.sortPlayers(next);

    }

    //======================================================
    // Próba rozwiązania wszystkich grup
    //======================================================

    static solveGroups(groups) {

        let games = [];

        for (let i = 0; i < groups.length; i++) {

            if (groups[i].length == 0)
                continue;

            if (groups[i].length % 2 == 1) {

                if (!this.borrowPlayer(groups, i))
                    return null;

            }

            let result = this.solveGroup(groups[i]);

            if (result == null) {

                this.returnPlayer(groups, i);

                return null;

            }

            games.push(...result);

        }

        return games;

    }

    //======================================================
    // Wielokrotna próba rozwiązania
    //======================================================

    static retry(groups) {

        let tries = 0;

        while (tries < 100) {

            const copy = PairingUtils.clone(groups);

            const games = this.solveGroups(copy);

            if (games != null)
                return games;

            tries++;

            if (!this.rotateGroups(groups))
                break;

        }

        return null;

    }

    //======================================================
    // Rotacja grup
    //======================================================

    static rotateGroups(groups) {

        for (let i = 0; i < groups.length - 1; i++) {

            if (groups[i + 1].length == 0)
                continue;

            const p = groups[i + 1].shift();

            groups[i].push(p);

            if (groups[i].length % 2 == 0)
                return true;

        }

        return false;

    }

    //======================================================
    // Ostateczne parowanie
    //======================================================

    static createPairings(players) {

        let list = PairingUtils.clone(players);

        PairingUtils.sortPlayers(list);

        const bye = PairingUtils.assignBye(list);

        let groups = PairingUtils.groupPlayers(list);

        groups = PairingUtils.balanceGroups(groups);

        let games = this.retry(groups);

        if (games == null)
            return null;

        if (bye != null) {

            games.push({

                table: games.length + 1,

                bye: true,

                playerA: bye,

                playerB: null,

                scoreA: 0,

                scoreB: 0

            });

        }

        this.renumber(games);

        return games;

    }}