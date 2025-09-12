import express from "express";
import Dinossauro from "../models/Dinossauro.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const dinos = await Dinossauro.find();
  res.json(dinos);
});

router.post("/", async (req, res) => {
  try {
    const dino = new Dinossauro(req.body);
    await dino.save();
    res.status(201).json(dino);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  const dino = await Dinossauro.findByIdAndDelete(req.params.id);
  if (!dino)
    return res.status(404).json({ error: "Dinossauro não encontrado" });
  res.json({ message: "Dinossauro removido" });
});

export default router;
