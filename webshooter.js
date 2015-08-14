/**
 * Created by kinnimew on 6/8/15.
 */
var config = require("./config");

var webshot = require('webshot');
var email = require('emailjs');

// create eamil service
var emailServer = email.server.connect({
    user: config.smtp.username,
    password: config.smtp.password,
    host: config.smtp.host,
    ssl: true
});


module.exports = {

    /**
     * This method is used to simulate a browser using WebKit from the Webshot module and save the screenshot.
     *
     * @param url The monitoring url.
     * @param outputPath The path to store the screenshot.
     * @param callback The callback when the process is done.
     */
    takeScreenshot: function (url, outputPath, callback) {


        webshot(url, outputPath, function (err) {
            callback(err, url);
        });
    },

    /**
     * This method is used to send email notification.
     *
     * @param email The email object containing the subject, message, sender, etc.
     * @param callback The callback when the email is sent.
     */
    send: function (email, callback) {

        // ensure sender address is set
        email.from = config.senderAddress;

        if (!email.to){
            email.to = config.recipients;
        }

        emailServer.send(email, function (err, message) {
            callback(err, message);
        });
    }
}
