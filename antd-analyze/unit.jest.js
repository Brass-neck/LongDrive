module.exports = {
  verbose: true, // 是否打日志
  testEnvironment: 'jsdom', // 运行测试的环境
  setupFiles: ['./tests/setup.js'], // 配置适配器
  testMatch: ['**/unit/**/*.(spec|test).(js|ts|jsx|tsx)'] // 配置要测试哪些文件，比如 button/unit/button.test.js
}
