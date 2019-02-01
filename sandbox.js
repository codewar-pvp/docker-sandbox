const { VM } = require('vm2');
const fs = require('fs');
const path = require('path');

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

try {
  fs.writeFileSync(
    path.join(__dirname, `sharedVol/testResults-${process.env.sandboxId}.json`),
    vm.run(`(function() {
    return {
      userCodeResult: (${process.env.userCode})(),
      userConsoleHistory: console.logHistory
  }
  })()`)
  );
} catch (error) {
  console.error(error);
}
