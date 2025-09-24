import Dinossauro from "../models/Dinossauro.js";

class DinossauroRepository {
  async add(dinoData) {
    try {
      const dino = new Dinossauro(dinoData);
      await dino.save();
      return dino;
    } catch (error) {
      throw new Error("Erro ao adicionar dinossauro: " + error.message);
    }
  }
  async findByname(nome) {
    return await Dinossauro.findOne({ nome });
  }

  async list() {
    return await Dinossauro.find();
  }
  async remove(nome) {
    await Dinossauro.deleteOne({ nome });
  }
}
export default DinossauroRepository;
