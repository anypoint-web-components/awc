/** @typedef {import('@web/test-runner').TestRunnerConfig} TestRunnerConfig */

export default /** @type TestRunnerConfig */ ({
  files: 'test/**/*.test.js',
  // files: 'test/variables/*.test.js',
  nodeResolve: true,
  // testFramework: {
  //   config: {
  //     timeout: 4000,
  //   }
  // },
  testsFinishTimeout: 60000,
})
