import path from "path";

const rootDirectory = path.resolve("");

const focosDirectory = path.resolve(rootDirectory, "..", "dataset", "focos");

const satelitesDirectoy = path.resolve(
  rootDirectory,
  "..",
  "dataset",
  "satelites"
);

const outputDirectory = path.resolve(
  rootDirectory,
  "..",
  "dataset",
  "mergedData"
);

export { rootDirectory, focosDirectory, satelitesDirectoy, outputDirectory };
