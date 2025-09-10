const connectMongo = require("./controllers/mongo");
const repoRecinto = new RecintoRepository();
const DinossauroRepository = require("./respositories/DinossauroRepository.js");
const DinossauroModel = require("./models/Dinossauro.js");
const Parque = require("./services/Parque.js");
const RecintoRepository = require("./respositories/RecintoRepository.js");

(async () => {
  await connectMongo();

  const repo = new DinossauroRepository();
  await repo.add({ nome: "Rex", especie: "Tyranossaurus", idade: 5 });
  await repo.add({ nome: "Blue", especie: "Velociraptor", idade: 2 });
  await repo.add({ nome: "Baiano", especie: "Baianossauro", idade: 10 });
  await repoRecinto.add({
    nome: "Val verde",
    tipo: "Carnivoro",
    capacidade: 2,
  });
  await repoRecinto.add({
    nome: "Selva Negra",
    tipo: "Herbivoro",
    capacidade: 2,
  });
  const todos = await repo.list();
  console.log(
    "Dinossauros cadastrados:",
    todos.map((d) => d.nome)
  );
})();

//Criação dos Dinossauros.

const recinto = await RecintoModel.findOne({ nome: "Lituania" });
const novoDino = new DinossauroModel({
  nome: "Rex",
  especie: "Tyranossaurus",
  idade: 5,
  recinto: recinto._id,
});
novoDino.save().then(() => console.log("Dinossauro salvo no banco de dados"));

// const dino1 = parque.criarDinossauro("Rex", "Tyranossaurus", 5);
// const parque = new Parque();
// const dino2 = parque.criarDinossauro("Blue", "Velociraptor", 3);
// const dino3 = parque.criarDinossauro("Baiano", "Baianosauro", 10);
//Criação dos Recintos.
// const recinto1 = parque.criarRecinto(1, "Herbivoro", "Val Verde", 2);
// const recinto2 = parque.criarRecinto(2, "Carnivoro", "Selva negra", 2);
// const recinto3 = parque.criarRecinto(3, "Herbivoro", "Casa Blanca", 3);

//Inserir dinossauro nos recintos.

// parque.inserirDinossauroNoRecinto("Rex", 2);
// parque.inserirDinossauroNoRecinto("Blue", 2);
// parque.inserirDinossauroNoRecinto("Baiano", 3);

//Listar dinossauro do recinto 2.
// console.log("Dinossauros no recinto 3:", parque.listarDinossaurosDoRecinto(3));

// parque.transferirDinossauro("Blue", 1);

// console.log("Dinossauros no recinto 1:", parque.listarDinossaurosDoRecinto(1));

// console.log("Dinossauros no recinto 2:", parque.listarDinossaurosDoRecinto(2));

// console.log(
//   "Todos os Dinossauros do parque :",
//   parque.listarTodosDinossauros()
// );
