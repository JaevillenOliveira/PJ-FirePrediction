import { createReadStream } from "fs";
import { join, resolve } from "path";
import { readdir } from "fs/promises";
import debug from "debug";
import { rejects } from "assert";

/////////////////////////////////////////////////////////////////
///DEBUG
const log = debug("app:concact");

const progressBar = () => {
  const ONE_SECOND = 1000;
  setInterval(() => process.stdout.write("."), ONE_SECOND).unref();
};

/////////////////////////////////////////////////////////////////
///ARQUIVOS
//PEGA UM ÚNICO ARQUIVO, CONFERE SE É CSV E RETORNA O STREAM DELE
const csvToReadableStream = (item, dir = "null") => {
  const path = dir ? join(dir, item) : item;
  return ~item.indexOf(".csv") && createReadStream(path);
};

//TRANSFORMA TODO O DIRETÓRIO EM READABLE
const readableDirectoryStream = async (directory) => {
  return (await readdir(directory)).map((item) => {
    return csvToReadableStream(item, directory);
  });
};

const getStreamByindex = async (directory, index) => {
  let files = await readdir(directory);
  return await csvToReadableStream(files[index], directory);
};

const directoryLen = async (directory) => {
  return await (await readdir(directory)).length;
};

export {
  progressBar,
  log,
  csvToReadableStream,
  readableDirectoryStream,
  getStreamByindex,
  directoryLen,
};
