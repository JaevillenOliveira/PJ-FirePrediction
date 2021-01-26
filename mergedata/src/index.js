import { focosDirectory } from "./resolvedPaths.js";
import { readableDirectoryStream, log, progressBar } from "./utils.js";
import WorkerPool from "./WorkerPool.js";

//DEBUG DA APLICAÇÃO
console.time("concat-data");
//progressbar de 1 em 1 segundo. até depois de todas as ações assíncronas
progressBar();

/////////////////////////////////////////////////////////////////
// Array de arquivos em stream
const focosStreamFiles = await readableDirectoryStream(focosDirectory);

log(`processing ${focosStreamFiles}`);

import { cpus } from "os";
///////////// OPCIONAL, VOCÊ PODE USAR O MÁXIMO DE CPUS OU SÓ ALGUMAS DELAS
//const NUM_CPUS_DISP = cpus().length;
//const NUM_CPUS_DISP = cpus().length -1;
const NUM_CPUS_DISP = 1;
const wp = new WorkerPool(NUM_CPUS_DISP);

await wp.runPool("./src/workerCicles.js", {
  type: "parseFocos",
  directory: focosDirectory,
  index: 0,
});

console.timeEnd("concat-data");
