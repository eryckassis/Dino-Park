import mongoose from "mongoose";

export default async function connectMongo() {
  try {
    await mongoose.connect("mongodb://localhost:27017/dino-park", {
      dbName: "dino-park",
      autoIndex: true,
    });
    console.log("MongoDB foi conetado ao projeto com sucesso !!");
  } catch (error) {
    console.error("Erro na conexão MongoDB:", error);
    process.exit(1);
  }
}
