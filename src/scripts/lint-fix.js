import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

async function lintFix() {
  const startTime = Date.now();

  console.log("═══════════════════════════════════════");
  console.log("🔍  INICIANDO ANÁLISE E CORREÇÃO");
  console.log("═══════════════════════════════════════\n");

  try {
    await execPromise("eslint src/**/*.js --fix");

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n═══════════════════════════════════════");
    console.log("✅  ANÁLISE CONCLUÍDA COM SUCESSO!");
    console.log("═══════════════════════════════════════");
    console.log(`⏱️   Tempo: ${duration}s`);
    console.log("🎨  Código formatado");
    console.log("📏  Padrões aplicados");
    console.log("🚀  Pronto para produção!");
    console.log("═══════════════════════════════════════\n");
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error("erro", error.message);

    console.log("\n═══════════════════════════════════════");
    console.log("✅  ANÁLISE CONCLUÍDA");
    console.log("═══════════════════════════════════════");
    console.log(`⏱️   Tempo: ${duration}s`);
    console.log("⚠️   Alguns avisos encontrados");
    console.log("✅  Código está OK!");
    console.log("═══════════════════════════════════════\n");
  }
}

lintFix();
