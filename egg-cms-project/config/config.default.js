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
      // 单数据库信息配置
      client: {
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: 'root',
        // 数据库名
        database: 'cms'
      },

      // 是否加载到 app 上，默认开启。通过 app.mysql.query(sql, values) 调用
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,

      // 多数据库配置
      /**
       * 使用方式
       *
       * const client1 = app.mysql.get('client');
       * const client2 = app.mysql.get('db2');
       * await client1.query(sql, values);
       * */
      db2: {
        host: 'mysql2.com',
        port: '3307',
        user: 'test_user',
        password: 'test_password',
        database: 'test'
      }
    }
  }

  return {
    ...config,
    ...userConfig
  }
}
