import { createReadStream } from 'fs'
import { parse } from 'fast-csv'
import whereIs from './whereIs.js'

async function focosDict(paths){
  var result = { lencois: [], piata: [] }
  let arrayLencois = []
  let arrayPiata = []

  const promises = []

  paths.forEach(path => {
    if(/.csv$/.test(path)){
      let readStream = createReadStream(path)
      promises.push(streamToPromisifyDict(readStream))
    }
  });

  const resolved = await Promise.all(promises)

  resolved.forEach(res => {
    arrayLencois = [...arrayLencois, ...res.lencois]
    arrayPiata = [...arrayPiata, ...res.piata]
  });

  result.lencois = arrayLencois
  result.piata = arrayPiata

  return result
}

function streamToPromisifyDict(stream){
  var result = { lencois: [], piata: [] }
  return new Promise((resolve, reject) => {
    stream.pipe(parse({ headers: true }))
    .on('error', error => {
      console.error(error)
      reject
    })
    .on('data', row => {
      let municipio = row['municipio']
      let satelite = whereIs(municipio)
      if(satelite === 'piata' || satelite === 'lencois'){
        result[satelite].push(row['data'])
      }else {
        console.log(`Satelite de ${satelite} encontrado ao construir o dicionário`);
      }
    })
    .on('end', rowCount => {
      resolve(result)
    })
  });
}

export default focosDict