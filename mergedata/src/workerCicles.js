import {
  getStreamByindex,
  getOutputFileName,
  sateliteDictionaryGenerator,
  satelitesCidadeDict,
} from "./utils.js";
import { parentPort, workerData } from "worker_threads";
import { promisify } from "util";
import { createWriteStream } from "fs";
import { pipeline, Transform } from "stream";

const pipelineAsync = promisify(pipeline);

import csvtojson from "csvtojson";
import jsontocsv from "json-to-csv-stream";

const { directory, index } = workerData;
/////////////////////////////////////////////////////////////////////
//PIPELINE;
var dict;

const handleStreamPiata = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    const rawData = JSON.parse(chunk);
    var data = {};
    var satelite = satelitesCidadeDict[rawData["municipio"]];
    const [ano, mes, dia] = rawData.datahora.split("/");

    if (satelite == "piata") {
      try {
        data = {
          ...rawData,
          "TEMPERATURA MEDIA MENSAL(°C)":
            dict.piata[ano][mes]["TEMPERATURA MEDIA; DIARIA (AUT)(Â°C)"],
          "UMIDADE RELATIVA DO AR MEDIA MENSAL(%)":
            dict.piata[ano][mes][
              "UMIDADE RELATIVA DO AR; MEDIA DIARIA (AUT)(%)"
            ],
        };
      } catch (err) {
        return callback(null, "");
      }
      return callback(null, JSON.stringify(data));
    } else if (satelite == "lencois") {
      try {
        data = {
          ...rawData,
          "TEMPERATURA MEDIA MENSAL(°C)":
            dict.lencois[ano][mes]["TEMPERATURA MEDIA COMPENSADA; MENSAL(°C)"],
          "UMIDADE RELATIVA DO AR MEDIA MENSAL(%)":
            dict.lencois[ano][mes]["UMIDADE RELATIVA DO AR; MEDIA MENSAL(%)"],
        };
      } catch (err) {
        return callback(null, "");
      }
      return callback(null, JSON.stringify(data));
    }
    return callback(null, "");
  },
});

const run = async () => {
  var finaloutputpiata;
  var finaloutputlencois;
  dict = await sateliteDictionaryGenerator();

  if (workerData.type == "parseFocos") {
    const stream = await getStreamByindex(directory, index);

    const output = await getOutputFileName(directory, index);

    const finaloutput = await createWriteStream(output);

    await pipelineAsync(
      stream,
      csvtojson(),
      handleStreamPiata,
      jsontocsv(),
      finaloutput
    );
  }
};

run().then(() => {
  parentPort.postMessage("oi");
});

//lencois
// {
//   'Data Medicao': 'JAN',
//   'INSOLACAO TOTAL; MENSAL(h)': '239.5',
//   'NEBULOSIDADE; MEDIA MENSAL(décimos)': '7.862903',
//   'NUMERO DE DIAS COM PRECIP; PLUV; MENSAL(número)': '',
//   'PRECIPITACAO TOTAL; MENSAL(mm)': '2.0',
//   'TEMPERATURA MAXIMA MEDIA; MENSAL(°C)': '32.764516',
//   'TEMPERATURA MEDIA COMPENSADA; MENSAL(°C)': '25.716774',
//   'TEMPERATURA MINIMA MEDIA; MENSAL(°C)': '18.393548000000006',
//   'UMIDADE RELATIVA DO AR; MEDIA MENSAL(%)': '65.94354799999999',
//   'Ano Medicao': '2019'
// }
// concat-data: 176.057ms

//piata
// {
//   Ano: '2019',
//   Mes: 'JAN',
//   'PRECIPITACAO TOTAL; DIARIO (AUT)(mm)': '0.3483870967741935',
//   'TEMPERATURA MEDIA; DIARIA (AUT)(Â°C)': '21.64596783870968',
//   'UMIDADE RELATIVA DO AR; MEDIA DIARIA (AUT)(%)': '62.74865596774193'
// }
