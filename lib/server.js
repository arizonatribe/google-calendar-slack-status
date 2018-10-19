const express = require('express')
const bodyParser = require('body-parser')
const env = require('./env')
const {
  errorLogger,
  createLogger,
  setSlackStatus,
  setSlackPresence,
  welcomeMessage
} = require('./middleware')

express()
  .use(errorLogger)
  .use(createLogger(env))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .get('/', welcomeMessage)
  .post('/',
    setSlackStatus(env),
    setSlackPresence(env),
    (req, res, _) => {
      res.status(200)
      res.send('🤘')
    }
  )
  .listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`)
  })
