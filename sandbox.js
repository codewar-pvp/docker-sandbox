const { VM } = require('vm2');
const fs = require('fs');

const vm = new VM({
  timeout: 5000,
  sandbox: {
    console: {
      log(logStr) {
        this.logHistory.push(logStr.toString());
      },
      logHistory: [],
    },
  },
});

let userCodeResultsArr;
let reqBody;

try {
  reqBody = JSON.parse(
    fs.readFileSync(`/vol/results-${process.env.sandboxId}.json`)
  );
  userCodeResultsArr = vm.run(
    reqBody.input +
      `.map(testInput => {
        return {
          userCodeResult: ((${reqBody.userCode})(testInput)),
          userConsoleHistory: console.logHistory
        }
      })`
  );
  fs.writeFileSync(
    `/vol/results-${process.env.sandboxId}.json`,
    JSON.stringify(userCodeResultsArr)
  );
} catch (error) {
  console.error(error);
}

module.exports = { userCodeResultsArr, reqBody };
