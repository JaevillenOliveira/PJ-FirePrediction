import path from "path";

const rootDirectory = path.resolve("");

const focosDirectory = path.resolve(rootDirectory, "..", "dataset", "focos", "FireSpotsByReferenceSatelite");

const metereologiaDirectory = path.resolve(rootDirectory, "..", "dataset", "meteorologia");

const outputDirectory = path.resolve(
  rootDirectory,
  "..",
  "dataset",
  "mergedData"
);

const resolvedWorkerCiclePath = path.resolve(rootDirectory, "src", "infra", "workerCicle.js")

export { focosDirectory, metereologiaDirectory, outputDirectory, resolvedWorkerCiclePath };
