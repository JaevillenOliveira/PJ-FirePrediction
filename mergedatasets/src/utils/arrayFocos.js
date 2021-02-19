import { readdir } from 'fs'
import { resolve as resolvePath } from 'path'

export async function arrayDir(url){  
  const arrayPaths = await new Promise((resolve, rejects) => {
    readdir(url , (err, files) => {
      if (err) console.error(err);
      const paths = files.map((file) => {
        return resolvePath(url, file)
      })
      resolve(paths)
    })
  })

  return arrayPaths

}

export async function arrayCurrentOutput(url, output){
  const arrayPaths = await new Promise((resolve, rejects) => {
    readdir(url , (err, files) => {
      if (err) console.error(err);
      const paths = files.map((file) => {
        return [ resolvePath(url, file), resolvePath(output, `merged_${file}`) ]
      })
      resolve(paths)
    })
  })

  return arrayPaths
}