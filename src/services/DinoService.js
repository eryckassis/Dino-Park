import Dinossauro from "../models/Dinossauro";
import Recinto from "../models/Recinto.js";

export async function inserirDinossauroNoRecinto(dinoData, recintoId) {
  const recinto = await Recinto.findById(recintoId);
  if (!recinto) {
    throw new Error("Recinto não foi Encontrado");
  }

  const totalRecinto = await Dinossauro.countDocuments({ recintoId });
  if (totalRecinto >= recinto.capacidade) {
    throw new Error("Capacidade máxima do recinto atingida");
  }

  const novoDino = await Dinossauro.create({ ...dinoData, recintoId });
  return novoDino;
}
