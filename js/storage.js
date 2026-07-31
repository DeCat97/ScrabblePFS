class Storage {

    //=========================================
    // Klucze
    //=========================================

    static PLAYERS = "players";

    static TOURNAMENTS = "tournaments";

    static SETTINGS = "settings";

    static BACKUP = "backup";

    //=========================================
    // Uniwersalne
    //=========================================

    static load(key, defaultValue = []) {

        try {

            const json = localStorage.getItem(key);

            if (!json)
                return defaultValue;

            return JSON.parse(json);

        }
        catch (e) {

            console.error(e);

            return defaultValue;

        }

    }

    static save(key, value) {

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    }

    //=========================================
    // Players
    //=========================================

    static getPlayers() {

        return this.load(this.PLAYERS);

    }

    static savePlayers(players) {

        this.save(

            this.PLAYERS,

            players

        );

    }

    //=========================================
    // Tournaments
    //=========================================

    static getTournaments() {

        return this.load(this.TOURNAMENTS);

    }

    static saveTournaments(tournaments) {

        this.save(

            this.TOURNAMENTS,

            tournaments

        );

    }

    //=========================================
    // Settings
    //=========================================

    static getSettings() {

        return this.load(

            this.SETTINGS,

            {}

        );

    }

    static saveSettings(settings) {

        this.save(

            this.SETTINGS,

            settings
             

        );

    }

    //=========================================
    // Backup
    //=========================================

    static createBackup() {

        const backup = {

            version: 1,

            date: new Date().toISOString(),

            players: this.getPlayers(),

            tournaments: this.getTournaments(),

            settings: this.getSettings()

        };

        this.save(

            this.BACKUP,

            backup

        );

        return backup;

    }

    static restoreBackup() {

        const backup = this.load(

            this.BACKUP,

            null

        );

        if (!backup)
            return false;

        this.savePlayers(

            backup.players || []

        );

        this.saveTournaments(

            backup.tournaments || []

        );

        this.saveSettings(

            backup.settings || {}

        );

        return true;

    }

    //=========================================
    // Czyszczenie
    //=========================================

    static clearAll() {

        localStorage.removeItem(

            this.PLAYERS

        );

        localStorage.removeItem(

            this.TOURNAMENTS

        );

        localStorage.removeItem(

            this.SETTINGS

        );

    }

}