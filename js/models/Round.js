class Round {

    constructor() {

        // Numer rundy
        this.number = 0;

        // HALF | SWISS | DUBOV | DANISH
        this.system = "HALF";

        // Partie
        this.games = [];

        // Status
        // NEW
        // IN_PROGRESS
        // FINISHED
        // APPROVED
        this.status = "NEW";

        // Daty
        this.created = new Date().toISOString();

        this.finishedDate = "";

        this.approvedDate = "";

        // Kto zatwierdził
        this.approvedBy = "";

    }

    //------------------------------------
    // Rozpoczęcie wpisywania wyników
    //------------------------------------

    start() {

        if (this.status === "NEW")
            this.status = "IN_PROGRESS";

    }

    //------------------------------------
    // Czy wszystkie wyniki wpisane
    //------------------------------------

    isComplete() {

        for (const game of this.games) {

            if (game.bye)
                continue;

            if (game.scoreA === null)
                return false;

            if (game.scoreB === null)
                return false;

        }

        return true;

    }

    //------------------------------------
    // Zakończenie wpisywania
    //------------------------------------

    finish() {

        if (!this.isComplete())
            return false;

        this.status = "FINISHED";

        this.finishedDate =
            new Date().toISOString();

        return true;

    }

    //------------------------------------
    // Zatwierdzenie
    //------------------------------------

    approve(user = "Sędzia") {

        if (this.status !== "FINISHED")
            return false;

        this.status = "APPROVED";

        this.approvedDate =
            new Date().toISOString();

        this.approvedBy = user;

        return true;

    }

    //------------------------------------
    // Cofnięcie zatwierdzenia
    //------------------------------------

    reopen() {

        this.status = "IN_PROGRESS";

        this.approvedDate = "";

        this.approvedBy = "";

    }

    //------------------------------------
    // Czy runda jest zatwierdzona
    //------------------------------------

    isApproved() {

        return this.status === "APPROVED";

    }

    //------------------------------------
    // Czy można edytować
    //------------------------------------

    canEdit() {

        return this.status !== "APPROVED";

    }

    //------------------------------------
    // Status tekstowy
    //------------------------------------

    getStatusName() {

        switch (this.status) {

            case "NEW":
                return "Nowa";

            case "IN_PROGRESS":
                return "W trakcie";

            case "FINISHED":
                return "Gotowa";

            case "APPROVED":
                return "Zatwierdzona";

            default:
                return "";

        }

    }

    //------------------------------------
    // Kolor statusu
    //------------------------------------

    getStatusColor() {

        switch (this.status) {

            case "NEW":
                return "#808080";

            case "IN_PROGRESS":
                return "#f0ad4e";

            case "FINISHED":
                return "#5bc0de";

            case "APPROVED":
                return "#5cb85c";

            default:
                return "#808080";

        }

    }

}