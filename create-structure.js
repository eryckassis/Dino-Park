const fs = require("fs-extra");
const path = require("path");

const structure = {
  src: {
    entities: {},
    services: {},
    respositories: {},
    utils: {},
    errors: {},
    "index.js": "",
  },
  tests: {},
  "README.md": "",
};

function criarPastas(basePath, structure) {
  Object.entries(structure).forEach(([name, content]) => {
    const fullPath = path.join(basePath, name);
    if (typeof content === "object") {
      fs.ensureDirSync(fullPath);
      criarPastas(fullPath, content);
    } else {
      fs.ensureFileSync(fullPath);
      if (content) {
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}

criarPastas(".", structure);
console.log("Estrutura de pastas criada com sucesso!");
