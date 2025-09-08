const Parque = require("./services/Parque.js");
const parque = new Parque();

//Criação dos Recintos.

const recinto1 = parque.criarRecinto(1, "Herbivoro", "Val Verde", 2);
const recinto2 = parque.criarRecinto(2, "Carnivoro", "Selva negra", 2);
const recinto3 = parque.criarRecinto(3, "Herbivoro", "Casa Blanca", 3);

//Criação dos Dinossauros.

const dino1 = parque.criarDinossauro("Rex", "Tyranossaurus", 5);
const dino2 = parque.criarDinossauro("Blue", "Velociraptor", 3);

//Inserir dinossauro nos recintos.

parque.inserirDinossauroNoRecinto("Rex", 2);
parque.inserirDinossauroNoRecinto("Blue", 2);

//Listar dinossauro do recinto 2.
console.log("Dinossauros no recinto 2:", parque.listarDinossaurosDoRecinto(2));
parque.transferirDinossauro("Blue", 1);
console.log("Dinossauros no recinto 1:", parque.listarDinossaurosDoRecinto(1));
console.log("Dinossauros no recinto 2:", parque.listarDinossaurosDoRecinto(2));
console.log(
  "Todos os Dinossauros do parque :",
  parque.listarDinossaurosDoRecinto()
);
