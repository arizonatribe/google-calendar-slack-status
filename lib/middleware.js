const slack = require('slack')
const format = require('date-fns/format')
const createBunyanLogger = require('express-bunyan-logger')
const differenceInMinutes = require('date-fns/difference_in_minutes')

const errorLogger = createBunyanLogger.errorLogger()

function createLogger({ level = 'TRACE' } = {}) {
  return createBunyanLogger({ level, name: 'google-slack-status-request' })
}

function setSlackPresence({ slackToken, herokuToken } = {}) {
  return async (req, res, next) => {
    const { token, presence } = req.body

    // Heroku token is required
    if (token === herokuToken && /away|auto/i.test(presence)) {
      await slack.users.setPresence({
        token: slackToken,
        presence: presence.toLowerCase()
      })
    }

    next()
  }
}

function setSlackStatus({ slackToken, herokuToken, timeZone } = {}) {
  const dndToken = ' [DND]'
  const formatTime = date => format(date, 'h:mmA')
  const twentyFiveMinsLater = (date = new Date()) => {
    date.setMinutes(date.getMinutes() + 25)
    return date
  }
  const setExpiration = expires => {
    if (!expires || typeof expires === 'number') {
      return expires
    }
    return twentyFiveMinsLater().valueOf()
  }

  return async (req, res, next) => {
    const {
      token,
      title,
      expires,
      start = new Date(),
      emoji = 'red_circle',
      end = twentyFiveMinsLater()
    } = req.body

    // Heroku token is required
    if (token === herokuToken && title) {
      // set Slack to DND if needed
      if (title.includes(dndToken)) {
        await slack.dnd.setSnooze({
          token: slackToken,
          num_minutes: differenceInMinutes(start, end)
        })
      }

      // set Slack status
      await slack.users.profile.set({
        token: slackToken,
        profile: JSON.stringify({
          status_expiration: setExpiration(expires),
          status_emoji: `:${emoji.replace(/:/g, '')}:`,
          status_text: `${
            title.replace(dndToken, '')
          } from ${formatTime(start)} to ${formatTime(end)} ${timeZone}`
        })
      })
    }

    next()
  }
}

const WELCOME_MESSAGE_TEMPLATE = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome!</title>
      <style>
        pre {
          background-color: #DDD;
          padding: 1em;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <h1>Your Heroku server is running!</h1>
      <p>You'll need the following information for your IFTTT recipe:</p>
      <h3>Body</h3>
      <pre>
{
  "token": "{{HerokuSecretToken}}",
  "title":"<<<{{Title}}>>>",
  "start":"{{Starts}}",
  "end":"{{Ends}}"
}
      </pre>
    </body>
  </html>
`

function welcomeMessage(req, res, _) {
  res.send(WELCOME_MESSAGE_TEMPLATE)
}

module.exports = {
  errorLogger,
  createLogger,
  setSlackStatus,
  setSlackPresence,
  welcomeMessage
}