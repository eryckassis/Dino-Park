import RecintoModel from "../models/Recinto.js";

class RecintoRepository {
  async add(data) {
    const recinto = new RecintoModel(data);
    return await recinto.save();
  }
  async list() {
    return await RecintoModel.find();
  }
}
export default RecintoRepository;
