import { focosDirectory } from "./resolvedPaths.js";
import { readableDirectoryStream, log, progressBar } from "./utils.js";
import WorkerPool from "./WorkerPool.js";

//DEBUG DA APLICAÇÃO
console.time("concat-data");

/////////////////////////////////////////////////////////////////
// Array de arquivos em stream
const focosStreamFiles = await readableDirectoryStream(focosDirectory);

log(`processing ${focosStreamFiles}`);

import { cpus } from "os";
///////////// OPCIONAL, VOCÊ PODE USAR O MÁXIMO DE CPUS OU SÓ ALGUMAS DELAS

const main = async () => {
  const NUM_CPUS_DISP = cpus().length;
  //const NUM_CPUS_DISP = cpus().length - 1;
  //const NUM_CPUS_DISP = 1;
  const wp = new WorkerPool(NUM_CPUS_DISP);

  for (var i = 0; i < 6; i++) {
    await wp.runPool("./src/workerCicles.js", {
      type: "parseFocos",
      directory: focosDirectory,
      index: i,
    });
  }
};

main().then(() => {
  console.timeEnd("concat-data");
});
