function buscaDePersonagem(nome) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const base = {
        Aragorn: { classe: "guerreiro", nivel: 10 },
        Gandalf: { classe: "mago", nivel: 100 },
      };
      const resultado = buscarNaBase(nome, base);
      if (resultado) return resolve(resultado);
      reject("Personagem não encontrado");
    }, 1000);
  });
}

function buscaNaBase(nome, base) {
  return base[nome] || null;
}

function buscaDePersonagem(nome) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const base = {
        Aragorn: { classe: "Guerreiro", nivel: 10 },
        Gandalf: { classe: "Mago", nivel: 12 },
      };
      const resultado = base[nome];
      if (!resultado) return reject("Personagem não encontrado.");
    }, 1000);
  });
}
