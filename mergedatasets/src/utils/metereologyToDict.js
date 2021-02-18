import { readdir } from 'fs/promises'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import { parse } from 'fast-csv'

async function metereologyToDict(url){
  let [lencoisFileName, piataFileName] = await readdir(url)
  lencoisFileName = resolve(url, lencoisFileName)
  piataFileName = resolve(url, piataFileName)

  const streamLencois = createReadStream(lencoisFileName)
  const streamPiata = createReadStream(piataFileName)
  
  const promiseLencois = streamToPromisifyDict(streamLencois)
  const promisePiata = streamToPromisifyDict(streamPiata)
 

  var results = await Promise.all([promiseLencois, promisePiata])
  return results
}

function streamToPromisifyDict(stream){
  let currentDict = {}
  return new Promise((resolve, reject) => {
    stream.pipe(parse({ headers: true }))
    .on('error', error => {
      console.error(error)
      reject(error)
    })
    .on('data', row => {
      let newRow = {}
      newRow[row['Data Medicao']] = row
      Object.assign(currentDict, newRow)
    })
    .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows from piata`)
      resolve(currentDict)
    })
  });
}

export default metereologyToDict