# Sync Google Calendar to your Slack status

# Instructions

For the full tutorial, please check out the Medium post here: [Syncing your Slack status with Google Calendar because nothing is sacred anymore](https://medium.com/@bjork24/syncing-your-slack-status-with-google-calendar-because-nothing-is-sacred-anymore-3032bd171770).

### Part 1

* Click the button on this page that says "Deploy to Heroku."
* Give your app a unique name. This will be part of your server’s URL, so make it memorable!
* Paste your Slack user token (should start with "xoxp-"), which you can find here, into the `SLACK_TOKEN` field. Choose the workspace you’d like to use, and copy (or generate) the token.
* Put a secret word or phrase in the `SECRET_TOKEN` field. You might even sprinkle in some emoji if you’re feeling particularly 😏.
* Finally, specify which time zone you’re working from in the `TIME_ZONE` field. This value will be appended to your status to avoid any schedule confusion.
* Click the "Deploy App" button and wait for Heroku to do its thing.
* When everything is finished, you should see "Your app was successfully deployed." and a button to view your newly provisioned app. Click that button.

### Part 2

* Head over to [IFTTT](https://ifttt.com) and either log in or sign up (use your Google account associated with your Google Calendar when you register)
* Click the "My Applets" link at the top of the page.
* Click the "New Applet" button.
* Click the "+ This" and type "Google Calendar."
* Click on the Google Calendar button.
* If you haven’t already, you’ll be prompted to connect your calendar to IFTTT, so go ahead and do that.
* For your action, click on "Any event starts."
* Choose the calendar you want to monitor, leave the "Time before event starts" at "0 minutes," and click the "Create trigger" button.
* Click the "+ That" and type "Webhooks."
* Click the Webhooks button and connect (if needed).
* Choose the "Make a web request" action.
* In the URL field, paste your Heroku server’s URL. In the example above, it would be https://google-calendar-slack-status.herokuapp.com
* Set the method to "POST" and the content type to "application/json."
* Finally, for the body field, paste the JSON object that was listed on your server’s home page. In our case, it’s this:

```
  {
    "title":"<<<{{Title}}>>>",
    "start":"{{Starts}}",
    "end":"{{Ends}}",
    "token": "your token"
  }
```

* Click the “Create Action” button.
* Smash the “Finish” button on the next page, and you’re all set!

# Running Locally

Place an `.env` file in the root of this project to run test locally. You will want to set the following values:

```
PORT=<defaults to 5000>
TIME_ZONE=<CST, MST, etc>
SECRET_TOKEN=<put your super secret Heroku token here>
SLACK_TOKEN=<put your slack USER token here, which starts with "xoxp-">
```

# TL;DR

Click the button below to begin your journey:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
