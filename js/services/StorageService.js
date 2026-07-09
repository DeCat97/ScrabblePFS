class StorageService {

    constructor(storageKey = "ScrabblePFS") {

        this.storageKey = storageKey;
        this.backupKey = storageKey + "_BACKUP";
        this.version = "1.0";

    }

    //==================================================
    // Zapis
    //==================================================

    save(data) {

        if (!data)
            return false;

        try {

            this.backup();

            const wrapper = {

                version: this.version,

                saved: new Date().toISOString(),

                data: data

            };

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(wrapper)
            );

            return true;

        }
        catch (e) {

            console.error(e);

            return false;

        }

    }

    //==================================================
    // Odczyt
    //==================================================

    load() {

        try {

            const json =
                localStorage.getItem(this.storageKey);

            if (!json)
                return null;

            const wrapper =
                JSON.parse(json);

            if (!this.validate(wrapper))
                return null;

            return wrapper.data;

        }
        catch (e) {

            console.error(e);

            return null;

        }

    }

    //==================================================
    // Czy zapis istnieje
    //==================================================

    exists() {

        return localStorage.getItem(
            this.storageKey
        ) !== null;

    }

    //==================================================
    // Usuń zapis
    //==================================================

    delete() {

        localStorage.removeItem(this.storageKey);

    }

    //==================================================
    // Backup
    //==================================================

    backup() {

        const json =
            localStorage.getItem(this.storageKey);

        if (!json)
            return;

        localStorage.setItem(
            this.backupKey,
            json
        );

    }

    //==================================================
    // Przywrócenie backupu
    //==================================================

    restoreBackup() {

        const json =
            localStorage.getItem(this.backupKey);

        if (!json)
            return false;

        localStorage.setItem(
            this.storageKey,
            json
        );

        return true;

    }

    //==================================================
    // Eksport
    //==================================================

    export(filename = "Tournament.json") {

        const json =
            localStorage.getItem(this.storageKey);

        if (!json)
            return false;

        const blob = new Blob(
            [json],
            { type: "application/json" }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;
        a.download = filename;

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        return true;

    }

    //==================================================
    // Import
    //==================================================

    async import(file) {

        try {

            const text =
                await file.text();

            const wrapper =
                JSON.parse(text);

            if (!this.validate(wrapper))
                throw new Error("Niepoprawny plik.");

            this.backup();

            localStorage.setItem(
                this.storageKey,
                text
            );

            return wrapper.data;

        }
        catch (e) {

            console.error(e);

            return null;

        }

    }

    //==================================================
    // Walidacja
    //==================================================

    validate(wrapper) {

        if (!wrapper)
            return false;

        if (!wrapper.version)
            return false;

        if (!wrapper.saved)
            return false;

        if (wrapper.data === undefined)
            return false;

        return true;

    }

    //==================================================
    // Informacje
    //==================================================

    getInfo() {

        const json =
            localStorage.getItem(this.storageKey);

        if (!json)
            return null;

        const wrapper =
            JSON.parse(json);

        return {

            version: wrapper.version,

            saved: wrapper.saved

        };

    }

    //==================================================
    // Rozmiar danych
    //==================================================

    getSize() {

        const json =
            localStorage.getItem(this.storageKey);

        if (!json)
            return 0;

        return new Blob([json]).size;

    }

}