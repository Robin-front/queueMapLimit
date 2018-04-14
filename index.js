class QueueMapLimit {
  constructor(concurrency) {
    this.running = 0;
    this.task = [];
    this.concurrency = concurrency;
  }
  add(arr, fn) {
    const self = this;
    const length = arr.length;
    const id = Symbol("#task");
    self.task.push(id);
    return new Promise((resolve, reject) => {
      var completed = 0;
      var started = 0;
      var results = new Array(length);

      (function refill() {
        if (completed >= length) {
          return resolve(results);
        }

        if (id === self.task[0]) {
          while (self.running < self.concurrency && started < length) {
            self.running++;
            started++;

            (function(index) {
              var cur = arr[index];
              fn
                .call(cur, cur, index, arr)
                .then(function(result) {
                  self.running--;
                  completed++;
                  results[index] = result;

                  refill();
                })
                .catch(err => {
                  self.running--;
                  completed++;

                  reject(err);
                });
            })(started - 1);
          }
          if (self.running >= self.concurrency && started < length) {
            setTimeout(refill, 0);
          }
          if (started >= length) {
            self.task.shift();
          }
        } else if (self.running >= self.concurrency || id !== self.task[0]) {
          setTimeout(refill, 0);
        }
      })();
    });
  }
}

module.exports = QueueMapLimit;
