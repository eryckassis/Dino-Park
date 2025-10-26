import express from "express";
import dotenv from "dotenv";
import connectMongo from "./controllers/mongo.js";
import dinossauroRoutes from "./routes/dinossauro.js";
import RecintoModel from "./models/Recinto.js";
import DinossauroRepository from "./repositories/DinossauroRepository.js";
import RecintoRepository from "./repositories/RecintoRepository.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/dinossauros", dinossauroRoutes);

const repoRecinto = new RecintoRepository();

(async () => {
  await connectMongo();
  const repo = new DinossauroRepository();

  // 🌱 Early return: Só executa seed se habilitado no .env
  const seedEnabled = process.env.SEED_ENABLED === "true";
  if (!seedEnabled) {
    console.log("🚫 Seed desabilitado via variável de ambiente");
    // Early return - para aqui e não executa o resto
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌱 Seed habilitado: NÃO`);
    });
    return;
  }

  // Só chega aqui se seed estiver habilitado
  console.log("🌱 Seed habilitado - iniciando população do banco...");
  await seedRecintos();
  await seedDinossauros();
  await adicionarDinossauroComRecinto();

  // 🚀 Porta do servidor vem do .env com fallback
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌱 Seed habilitado: SIM`);
  });

  async function seedDinossauros() {
    console.log("🦕 Iniciando seed de dinossauros...");

    const dinos = [
      { nome: "Rex", especie: "Tyranossaurus", idade: 5 },
      { nome: "Blue", especie: "Velociraptor", idade: 2 },
      { nome: "Baiano", especie: "Baianossauro", idade: 10 },
    ];

    for (const dino of dinos) {
      try {
        // Early return: Se já existe, continua para o próximo
        const existente = await repo.findByname(dino.nome);
        if (existente) {
          console.log(`✅ ${dino.nome} já existe, mantendo o existente`);
          continue;
        }

        // Só chega aqui se NÃO existir
        await repo.add(dino);
        console.log(`🆕 ${dino.nome} adicionado com sucesso!`);
      } catch (error) {
        console.error(`❌ Erro ao processar ${dino.nome}:`, error.message);
        continue;
      }
    }
    console.log("🎉 Seed de dinossauros concluído!");
  }

  async function seedRecintos() {
    console.log("🏞️ Iniciando seed de recintos...");

    // Early return: Se seed de recintos está desabilitado
    const maxCapacidade =
      parseInt(process.env.MAX_DINOSSAUROS_POR_RECINTO) || 2;

    const recintos = [
      { nome: "Val verde", tipo: "Carnivoro", capacidade: maxCapacidade },
      { nome: "Selva Negra", tipo: "Herbivoro", capacidade: maxCapacidade },
      { nome: "Lituania", tipo: "Herbivoro", capacidade: maxCapacidade },
    ];

    for (const recintoData of recintos) {
      try {
        // Early return: Se já existe, continua para o próximo
        const existente = await repoRecinto.findByName(recintoData.nome);
        if (existente) {
          console.log(`✅ Recinto ${recintoData.nome} já existe`);
          continue;
        }

        // Só chega aqui se NÃO existir
        await repoRecinto.add(recintoData);
        console.log(
          `🆕 Recinto ${recintoData.nome} criado! (Cap: ${recintoData.capacidade})`
        );
      } catch (error) {
        console.error(
          `❌ Erro ao criar recinto ${recintoData.nome}:`,
          error.message
        );
        continue;
      }
    }
    console.log("🎉 Seed de recintos concluído!");
  }

  async function adicionarDinossauroComRecinto() {
    console.log("🦕🏞️ Verificando dinossauro com recinto...");

    try {
      // Early return: Se o Baiano com recinto já existe, para aqui
      const baianoComRecinto = await repo.findByname("Baiano-Lituania");
      if (baianoComRecinto) {
        console.log("✅ Baiano já está alocado em recinto");
        return;
      }

      // Early return: Busca o recinto, se não achar para aqui
      const recinto = await RecintoModel.findOne({ nome: "Lituania" });
      if (!recinto) {
        console.log("❌ Recinto Lituania não encontrado");
        return;
      }

      // Cria o dinossauro com nome único para evitar duplicação
      await repo.add({
        nome: "Baiano-Lituania",
        especie: "Baianossauro",
        idade: 10,
        recinto: recinto._id,
      });

      console.log("🆕 Baiano alocado no recinto Lituania!");
    } catch (error) {
      console.error("❌ Erro ao alocar dinossauro no recinto:", error.message);
      return;
    }
  }

  const todos = await repo.list();
  console.log(
    "🦕 Dinossauros no parque:",
    todos.map((d) => d.nome)
  );
})();
//
