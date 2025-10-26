import { validarCapacidadeRecinto } from "../../src/services/DinoService.js";

describe("Validação de capacidade do recinto", () => {
  test("deve permitir adicionar se houver espaços", () => {
    const recinto = { capacidade: 5, ocupados: 3 };
    const resultado = validarCapacidadeRecinto(recinto);
    expect(resultado).toBe(true);
  });

  test("deve bloquear recinto se estiver lotado", () => {
    const recinto = { capacidade: 5, ocupados: 5 };
    expect(() => {
      validarCapacidadeRecinto(recinto);
    }).toThrow("Capacidade máxima atingida");
  });

  test("deve bloquear se recinto passar da capacidade", () => {
    const recinto = { capacidade: 5, ocupados: 6 };
    expect(() => {
      validarCapacidadeRecinto(recinto);
    }).toThrow("Capacidade máxima atingida");
  });
});
