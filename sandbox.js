const { VM } = require('vm2');

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
  const result = vm.run(`
  (
    function() {
      return {
        userCodeResult: ((${process.env.userCode})()),
        userConsoleHistory: console.logHistory
      }
    }
  )()`);
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(error);
}
