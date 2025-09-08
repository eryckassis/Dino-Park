const RecintoModel = require("../models/Recinto");

class RecintoRepository {
  async add(data) {
    const recinto = new RecintoModel(data);
    return await recinto.save();
  }
  async list() {
    return await RecintoModel.find();
  }
}
module.exports = RecintoRepository;
