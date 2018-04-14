const QueueMapLimit = require("./index.js");

const queue = new QueueMapLimit(5);

const random = (start, end) =>
  Math.round(Math.random() * (end - start)) + start;

let taskLength = 10;
let taskIndex = 0;
while (taskLength--) {
  const arr = Array.from({ length: random(1, 10) }, () => taskIndex++);
  queue
    .add(
      arr,
      index =>
        new Promise((resolve, reject) => {
          console.log("begin", index);
          setTimeout(() => {
            console.log("end", index);
            random(0, 10) > 9 ? reject(undefined) : resolve(index);
          }, random(1, 50));
        })
    )
    .then(result => {
      console.log("task done ", result);
    })
    .catch((err) => {
      console.error("task has error ", arr);
    });
}
