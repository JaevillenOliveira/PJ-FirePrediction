import { workerData } from "worker_threads";
import metereologyToDict from "../utils/metereologyToDict.js";

const { metereologiaDirectory, foco } = workerData

async function run(){
  const dir = await metereologyToDict(metereologiaDirectory)

  
}

run()