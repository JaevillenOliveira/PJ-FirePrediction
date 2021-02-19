import { resolvedWorkerCiclePath, focosDirectory, outputDirectory, metereologiaDirectory} from './utils/resolvedPaths.js'
import WorkerPool from './infra/WorkerPool.js'
import { arrayCurrentOutput, arrayDir } from './utils/arrayFocos.js'


async function parseData(){
  console.time('parse-data');
  const cpu_len = 3
  const wp = new WorkerPool(cpu_len)

  const focosPaths = await arrayDir(focosDirectory)

  const dados = await arrayCurrentOutput(metereologiaDirectory, outputDirectory)
  let promises = []

  dados.forEach((dado) => {

    let pool = wp.runPool(resolvedWorkerCiclePath, {
        focosPaths,
        dado
      });

    promises.push(pool)
  })

  Promise.all(promises).then((message) => {
    console.log(message);
    console.timeEnd('parse-data')
  })

}

parseData()

// const dict = await metereologyToDict(metereologiaDirectory)