import express from "express";
import connectMongo from "./controllers/mongo.js";
import dinossauroRoutes from "./routes/dinossauro.js";
import RecintoModel from "./models/Recinto.js";
const repoRecinto = new RecintoRepository();
import DinossauroRepository from "./respositories/DinossauroRepository.js";
import DinossauroModel from "./models/Dinossauro.js";
import RecintoRepository from "./respositories/RecintoRepository.js";

const app = express();
app.use(express.json());
app.use("/dinossauros", dinossauroRoutes);

(async () => {
  await connectMongo();

  const PORT = process.env.port || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

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

  await repoRecinto.add({
    nome: "Lituania",
    tipo: "Herbivoro",
    capacidade: 2,
  });

  const recinto = await RecintoModel.findOne({ nome: "Lituania" });

  await repo.add({
    nome: "Baiano",
    especie: "Baianossauro",
    idade: 10,
    recinto: recinto._id,
  });

  const todos = await repo.list();
  console.log(
    "Dinossauros cadastrados:",
    todos.map((d) => d.nome)
  );
})();
