import Dinossauro from "../../src/models/Dinossauro";

describe("Dinossauro Model", () => {
  test("deve criar dinossauro com dados válidos", () => {
    const dados = {
      nome: "Rex",
      especie: "Tyranossaurus",
      idade: 5,
    };

    const dino = new Dinossauro(dados);

    expect(dino.nome).toBe("Rex");
    expect(dino.especie).toBe("Tyranossaurus");
    expect(dino.idade).toBe(5);
  });

  test("deve conter valores padrões corretamente", () => {
    const dino = new Dinossauro({
      nome: "Rex",
      especie: "Tyranossaurus",
    });

    expect(dino.idade).toBe(0);
    expect(dino.recintoId).toBeNull();
  });
});
