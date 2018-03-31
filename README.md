# Webshooter

Webshooter is a simple node app which monitors a website's status by simulating a web browser using the WebKit from PhantomJS to render the page and send the screenshot to the recipients periodically at certain time interval. 

## Usage

First call `npm install` and install the necessary modules.

Replace the items in config.js 
 * url - the url address of the website you want to monitor
 * smtp - the smtp settings used to send email notification
 * senderAddress - the display email address in the notification email
 * recipients - the array of email addresses who will receive the email notification
 * interval - the interval which Webshooter will make actions, interval should >=1 minute

It is recommended to run this node app with [forever](https://github.com/foreverjs/forever) CLI tool.

```bash
forever start app.js
```

## Test

Tests are written with [Mocha](http://mochajs.org/) and can be run with `npm test`.



## Node modules used:

 * [node-webshot](https://github.com/brenden/node-webshot) for making the screenshot
 * [emailjs](https://github.com/eleith/emailjs) for sending the notification email
 * [node-dateformat](https://github.com/felixge/node-dateformat) for formatting the time
 * [node-schedule](https://github.com/tejasmanohar/node-schedule) for scheduling the task
