const fb = require("fibonacci");
const { isMainThread, parentPort, workerData } = require("worker_threads");
const Pool = require("worker-threads-pool");
const CPUs = require("os").cpus().length;
const pool = new Pool({ max: CPUs });

const runFibonacci = (workerData) => {
  return new Promise((resolve, reject) => {
    pool.acquire(__filename, { workerData }, (err, worker) => {
      if (err) reject(err);
      console.log(`started worker ${worker} (pool size: ${pool.size})`);
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  });
};

/**
 * If it's not the main thread it's one of the Worker threads
 */
if (!isMainThread) {
  const result = fb.iterate(workerData.iterations);
  /**
   * Send a copy the result object back to the main Thread
   */
  parentPort.postMessage(result);
}

module.exports = runFibonacci;

// const Pool = require('worker-threads-pool')

// const pool = new Pool({max: 5})

// for (let i = 0; i < 100; i++) {
//   pool.acquire('/my/worker.js', function (err, worker) {
//     if (err) throw err
//     console.log(`started worker ${i} (pool size: ${pool.size})`)
//     worker.on('exit', function () {
//       console.log(`worker ${i} exited (pool size: ${pool.size})`)
//     })
//   })
// }
