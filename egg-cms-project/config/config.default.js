/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1641894205619_5145'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    mysql: {
      client: {
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: '数据库名cms'
      }
    }
  }

  return {
    ...config,
    ...userConfig
  }
}
