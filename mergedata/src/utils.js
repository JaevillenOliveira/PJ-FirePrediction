import { createReadStream, readFileSync, readSync } from "fs";
import {
  satelitesDirectoy,
  rootDirectory,
  outputDirectory,
} from "./resolvedPaths.js";
import { join, resolve } from "path";
import { readdir } from "fs/promises";
import debug from "debug";

import csvtojson from "csvtojson";

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

const getOutputFileName = async (directory, index) => {
  let files = await readdir(directory);
  let currentFileName = files[index].substring(5, files[index].length);

  let merged = "Merged" + currentFileName;

  return await join(outputDirectory, merged);
};

const sateliteDictionaryGenerator = async () => {
  var sateliteDict;
  let files = await readdir(satelitesDirectoy);
  let lencois;

  await csvtojson()
    .fromFile(join(satelitesDirectoy, files[0]))
    .then(function (jsonArrayObj) {
      lencois = jsonArrayObj;
    });

  let piata;

  await csvtojson()
    .fromFile(join(satelitesDirectoy, files[1]))
    .then(function (jsonArrayObj) {
      piata = jsonArrayObj;
    });

  let anos = new Set(
    lencois.map((value) => {
      return value["Ano Medicao"];
    })
  );

  sateliteDict = {
    lencois: {},
    piata: {},
  };

  await anos.forEach((ano) => {
    sateliteDict.lencois[ano] = {};
    sateliteDict.piata[ano] = {};
  });

  await lencois.forEach((line) => {
    var mes = mesdict[line["Data Medicao"]];

    const newobj = { [mes]: line };
    sateliteDict.lencois[line["Ano Medicao"]] = {
      ...sateliteDict.lencois[line["Ano Medicao"]],
      ...newobj,
    };
  });

  await piata.forEach((line) => {
    var mes = mesdict[line["Mes"]];
    const newobj = { [mes]: line };

    sateliteDict.piata[line["Ano"]] = {
      ...sateliteDict.piata[line["Ano"]],
      ...newobj,
    };
  });

  return sateliteDict;
};

const mesdict = {
  JAN: "01",
  FEV: "02",
  MAR: "03",
  ABR: "04",
  MAI: "05",
  JUN: "06",
  JUL: "07",
  AGO: "08",
  SET: "09",
  OUT: "10",
  NOV: "11",
  DEZ: "12",
};

const satelitesCidadeDict = {
  BONINAL: "piata",
  ANDARAI: "Lencois",
  IBICOARA: "piata",
  IRAMAIA: "itiruçu",
  IRAQUARA: "lencois",
  ITAETE: "lencois",
  LENCOIS: "lencois",
  MUCUGE: "piata",
  "NOVA REDENCAO": "lencois",
  PALMEIRAS: "lencois",
};

export {
  progressBar,
  log,
  csvToReadableStream,
  readableDirectoryStream,
  getStreamByindex,
  directoryLen,
  getOutputFileName,
  sateliteDictionaryGenerator,
  mesdict,
  satelitesCidadeDict,
};
