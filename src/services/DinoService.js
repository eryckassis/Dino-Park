import Dinossauro from "../models/Dinossauro";
import Recinto from "../models/Recinto.js";

/**
 * Valida se um recinto tem capacidade disponível
 * @param {Object} recinto - Objeto com capacidade e ocupados
 * @returns {boolean} - True se houver espaço
 * @throws {Error} - Se capacidade estiver esgotada
 */
export function validarCapacidadeRecinto(recinto) {
  if (!recinto) {
    throw new Error("Recinto não informado");
  }

  if (!recinto.capacidade || recinto.capacidade < 1) {
    throw new Error("Capacidade inválida");
  }

  const ocupados = recinto.ocupados || 0;

  if (ocupados >= recinto.capacidade) {
    throw new Error("Capacidade máxima atingida");
  }

  return true;
}

/**
 * Insere um dinossauro em um recinto validando capacidade
 * @param {Object} dinoData - Dados do dinossauro
 * @param {String} recintoId - ID do recinto
 * @returns {Object} - Dinossauro criado
 */
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
