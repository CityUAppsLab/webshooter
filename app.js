/**
 * Created by kinnimew on 10/8/15.
 */
var config = require('./config');

var webshooter = require('./webshooter');

var dateFormat = require('dateformat');
var schedule = require('node-schedule');


schedule.scheduleJob('*/' + config.interval + ' * * * *', function () {

    var startTime = new Date();

    console.log("job started at " + startTime);

    var now = dateFormat(startTime, 'yyyymmddHHMM');
    var outputFilePath = 'screenshots/' + now + '.png';

    webshooter.takeScreenshot(config.url, outputFilePath, function (err) {

        var endTime = new Date();

        console.log("Elapsed Time = " + (endTime - startTime) + "ms");

        var email = {
            to: config.recipients
        };

        if (err) {

            // Connection error
            email.subject = 'Webshooter - ' + config.url;
            email.text = "Connection Alert";

        } else {

            // Everything works fine
            email.subject = 'Webshooter - ' + config.url;
            email.text = "Elapsed Time = " + (endTime - startTime) + "ms";
            email.attachment = [
                {path: outputFilePath, name: now + ".png"}
            ]
        }

        webshooter.send(email, function (err, result) {
        });

    })
});


console.log("Let's go! " + new Date());