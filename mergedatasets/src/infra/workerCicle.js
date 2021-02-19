import { workerData, parentPort } from "worker_threads";
import jsontocsv from "json-to-csv-stream";
import { createReadStream, createWriteStream } from 'fs'
import { parse } from 'fast-csv'
import focosDict from '../utils/focosDict.js'

const { focosPaths, dado } = workerData
const [ currentFileName, outputFileName ] = dado
async function run(){
  const dirFocos = await focosDict(focosPaths)

  const stream = createReadStream(currentFileName)
  const output = createWriteStream(outputFileName)

  stream.pipe(parse({ headers: true }))
    .transform((row, next) => {
      let satelite
      let date = row['Data Medicao']

      let has_Foco = false

      satelite = row['Latitude'] === '-12.557853999999999' ?  'lencois' : 'piata'

      if(dirFocos[satelite].includes(date)){
        has_Foco = true;
      }

      return next(null,
        JSON.stringify({
          ...row,
          has_Foco: has_Foco ? 1 : 0
        }))
        
    })
    .pipe(jsontocsv())
    .pipe(output)

  
}

run().then(() => {
  parentPort.postMessage("finished");
});