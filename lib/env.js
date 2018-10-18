const envalid = require('envalid')

const {str, port} = envalid

const env = envalid.cleanEnv(process.env, {
  SECRET_TOKEN: str({
    desc: 'The required secure token for accessing the Heroku cloud'
  }),
  LOG_LEVEL: str({
    default: 'INFO',
    desc: 'Logging statements are collected to sdout or ignored, based on the threshold you set (default is "INFO")'
  }),
  TIME_ZONE: str({
    default: 'MST',
    desc: 'Your timezone'
  }),
  PORT: port({
    default: 5000,
    desc: 'The port number on which this server runs'
  }),
  SLACK_TOKEN: str({
    desc: 'The required secure token that allows access to the Slack APIs'
  })
})

const getLogLevel = rawLevel =>
  (/^(info|warn|debug|trace|error|fatal)$/i.test(rawLevel)
    ? rawLevel.replace(/\s/g, '').toUpperCase()
    : 'INFO')

module.exports = {
  port: env.PORT,
  timeZone: env.TIME_ZONE,
  slackToken: env.SLACK_TOKEN,
  herokuToken: env.SECRET_TOKEN,
  isProduction: env.isProduction,
  level: getLogLevel(env.LOG_LEVEL)
}
