import mongoose from "mongoose";

export default async function connectMongo() {
  try {
    await mongoose.connect("mongodb://localhost:27017/dino-park", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB foi conetado ao projeto com sucesso !!");
  } catch (error) {
    console.error("Erro na conexão MongoDB:", error);
    process.exit(1); // aqui, ecerramos o app se não conectar
  }
}
