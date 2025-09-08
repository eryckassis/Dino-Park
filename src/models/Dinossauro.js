const mongoose = require("mongoose");

const DinossauroSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  especie: { type: String, required: true, trim: true },
  idade: { type: Number, default: 0, min: 0 },
  recintoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recinto",
    default: null,
  },
});

module.exports = mongoose.model("Dinossauro", DinossauroSchema);
