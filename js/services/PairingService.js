class PairingService{

    static generate(system, players){

        switch(system){

            case "HALF":
                return HalfSwiss.generate(players);

            case "SWISS":
                return Swiss.generate(players);

            case "DUBOV":
                return Dubov.generate(players);

            case "DANISH":
                return Danish.generate(players);

        }

    }

}