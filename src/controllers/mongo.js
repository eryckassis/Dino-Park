import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectMongo() {
  try {
    const dbUri = process.env.DB_URI || "mongodb://localhost:27017/dino-park";
    await mongoose.connect(dbUri);

    console.log(`MongoDB conectado com sucesso!`);
    console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
    console.log(`Banco: ${process.env.DB_NAME || "dino-park"}`);
  } catch (error) {
    console.error("Erro com a conexão MongoDB:", error.message);
    console.error(
      "Verifique se o MongoDB está rodando e as variaveis de ambiente estão corretas."
    );
    process.exit(1);
  }
}
