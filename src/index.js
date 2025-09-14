import express from "express";
import connectMongo from "./controllers/mongo.js";
import dinossauroRoutes from "./routes/dinossauro.js";
import RecintoModel from "./models/Recinto.js";
const repoRecinto = new RecintoRepository();
import DinossauroRepository from "./respositories/DinossauroRepository.js";
import RecintoRepository from "./respositories/RecintoRepository.js";

const app = express();
app.use(express.json());
app.use("/dinossauros", dinossauroRoutes);

(async () => {
  await connectMongo();
  const repo = new DinossauroRepository();
  await seedDinossauros();

  const PORT = process.env.port || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  async function seedDinossauros() {
    const dinos = [
      { nome: "Rex", especie: "Tyranossaurus", idade: 5 },
      { nome: "Blue", especie: "Velociraptor", idade: 2 },
      { nome: "Baiano", especie: "Baianossauro", idade: 10 },
    ];

    for (const dino of dinos) {
      const existente = await repo.findByname(dino.nome);
      if (!existente) {
        await repo.add(dino);
      }
    }
  }

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
//
