import mongoose from "mongoose";

const RecintoSchema = new mongoose.Schema({
  tipo: { type: String, required: true, trim: true },
  nome: { type: String, required: true, trim: true },
  capacidade: { type: Number, required: true, min: 1 },
});

export default mongoose.model("Recinto", RecintoSchema);
