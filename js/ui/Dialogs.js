class Dialogs {

    static open(id){

        document
            .getElementById(id)
            .classList
            .remove("hidden");

    }

    static close(id){

        document
            .getElementById(id)
            .classList
            .add("hidden");

    }

}