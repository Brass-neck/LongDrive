module.exports = {
  verbose: true,
  testEnvironment: 'jest-environment-puppeteer',
  setupFiles: ['./tests/setup.js'], // 配置适配器
  preset: 'jest-puppeteer',
  testMatch: ['**/e2e/**/*.(spec|test).(js|ts|jsx|tsx)'] // 匹配 e2e 文件夹下的文件
}
