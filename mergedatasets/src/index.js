import { resolvedWorkerCiclePath, metereologiaDirectory, focosDirectory} from './utils/resolvedPaths.js'
import WorkerPool from './infra/WorkerPool.js'
import { arrayFocos } from './utils/arrayFocos.js'


async function parseData(){
  const cpu_len = 3
  const wp = new WorkerPool(cpu_len)

  const focosPaths = await arrayFocos(focosDirectory)

  wp.runPool(resolvedWorkerCiclePath, {
      metereologiaDirectory,
      foco: focosPaths[0],
  });

  // for (foco of focosPaths) {
  //   await wp.runPool(resolvedWorkerCiclePath, {
  //     dictPath: metereologiaDirectory,
  //     directory: foco,
  //   });
  // }

}

parseData()

// const dict = await metereologyToDict(metereologiaDirectory)