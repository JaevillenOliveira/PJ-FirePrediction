import { rejects } from 'assert';
import { readdir } from 'fs'
import { resolve, resolve as resolvePath } from 'path'

export async function arrayFocos(url){  
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