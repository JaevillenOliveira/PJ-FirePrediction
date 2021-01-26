import Pool from "worker-threads-pool";

class WorkerPool {
  constructor(cpu_len) {
    this.cpu_len = cpu_len;
    this.pool = new Pool(cpu_len);
  }

  runPool(filename, workerData) {
    return new Promise((resolve, reject) => {
      this.pool.acquire(filename, { workerData }, (err, worker) => {
        if (err) throw err;
        console.log(`started worker (pool size: ${this.pool.size})`);
        worker.on("message", resolve);
        worker.on("error", reject);
      });
    });
  }
}

export default WorkerPool;
