class Parque {
  constructor() {
    this.recintos = [];
    this.dinossauros = [];
  }

  criarRecinto(id, tipo, nome, capacidade) {
    const Recinto = require("../entities/Recintos");
    const novoRecinto = new Recinto(id, tipo, nome, capacidade);
    this.recintos.push(novoRecinto);
    return novoRecinto;
  }

  criarDinossauro(nome, especie, idade) {
    const Dinossauro = require("../entities/Dinossauro");
    const novoDinossauro = new Dinossauro(nome, especie, idade);
    this.dinossauros.push(novoDinossauro);
    return novoDinossauro;
  }

  inserirDinossauroNoRecinto(nomeDinossauro, idRecinto) {
    const dino = this.dinossauros.find((d) => d.nome === nomeDinossauro);
    const recinto = this.recintos.find((r) => r.id === idRecinto);
    if (!dino) throw new Error("Dinossauro não pode ser encontrado!");
    if (!recinto) throw new Error("O Recinto não pode ser encontrado!");

    recinto.adicionarDinossauros(dino);
  }

  transferirDinossauro(nomeDinossauro, idRecintoDestino) {
    const dino = this.dinossauros.find((d) => d.nome === nomeDinossauro);
    const recintoDestino = this.recintos.find((r) => r.id === idRecintoDestino);
    if (!dino) throw new Error("O Dinossauro não pode ser encontrado!");
    if (!recintoDestino)
      throw new Error("O Recinto destino não foi encontrado!");
  }
}
