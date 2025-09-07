const Parque = require("./services/Parque");
const parque = new Parque();

//Criação dos Recintos.

const recinto1 = parque.criarRecinto(1, "Herbivoro", "Val Verde", 2);
const recinto2 = parque.criarRecinto(2, "Carnivoro", "Selva negra", 2);
const recinto3 = parque.criarRecinto(3, "Herbivoro", "Casa Blanca", 3);

//Criação dos Dinossauros.

const dino1 = parque.criarDinossauro("Rex", "Tyranossaurus", 5);
const dino2 = parque.criarDinossauro("Blue", "Velociraptor", 3);
