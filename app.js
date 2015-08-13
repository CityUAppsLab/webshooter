/**
 * Created by kinnimew on 10/8/15.
 */
var config = require('./config');

var webshooter = require('./webshooter');

var dateFormat = require('dateformat');
var schedule = require('node-schedule');

var mongoose = require('mongoose');
var mongodbOptions = {
    user: config.mongodb.username,
    password: config.mongodb.password
}
mongoose.connect('mongodb://' + config.mongodb.host + "/" + config.mongodb.database, mongodbOptions, function (err) {
    console.log(err || "mongodb connection OK");
});


var Log = mongoose.model('Log', {
    url: {type: String},
    startTime: {type: Date},
    endTime: {type: Date},
    elapsed: {type: Number}
});


var interval = '*/' + config.interval + ' * * * *';


var CV_HOME_URL = 'https://compassvisa.com.hk';
var CV_API_URL = 'https://www.compassvisa.com.hk/iphoneapi/getLoginUserInfo.ashx';
var BENCHMARK_URL = 'google.com';

schedule.scheduleJob(interval, function () {

    var startTime = new Date();

    console.log("job started at " + startTime);

    var filename = dateFormat(startTime, 'yyyymmddHHMM') + '.png';

    // Check https://compassvisa.com.hk
    webshooter.takeScreenshot(CV_HOME_URL, "screenshot/cv_home/" + filename, function (err) {

        var endTime = new Date();

        console.log("Elapsed Time = " + (endTime - startTime) + "ms");

        var cvHomeLog = new Log({
            url: CV_HOME_URL,
            startTime: startTime,
            endTime: endTime,
            elapsed: (endTime - startTime)
        });

        cvHomeLog.save();

        if (true) {
            var email = {
                subject: 'Connection Alert - ' + CV_HOME_URL,
                text: "Dear Sir/Madam\n\n" +
                "This is a auto-generated message to alert on connection issue:\n\n" +
                "    URL: " + CV_HOME_URL + "\n" +
                "    STATUS: unreachable\n" +
                "    TIME: " + startTime + "\n\n" +
                "Please take corresponding action for the connection check.\n\n" +
                "Note: connection issue may be due to poor network connection at host.\n",
                attachment: [
                    {
                        data: "Dear Sir/Madam<br><br>" +
                        "This is an auto-generated message to alert you on the coonection issue.<br><br>" +
                        "   URL: " + CV_HOME_URL + "<br>" +
                        "   STATUS: unreachable<br>" +
                        "   TIME: " + startTime + "<br>" +
                        "   Elapsed: " + cvHomeLog.elapsed + "<br>" +
                        "<br>" +
                        "Please take corresponding action for the connection check.<br>" +
                        "Note: connection issue may be due to poor network connection at host.<br>"

                        , alternative: true
                    },
                    {
                        path: "screenshot/cv_home/" + filename, name: filename
                    }
                ]
            };

            webshooter.send(email, function (err, result) {
                console.log(err || result);
            });

        }


    });

    // Check https://www.compassvisa.com.hk/iphoneapi/getLoginUserInfo.ashx
    webshooter.takeScreenshot(CV_API_URL, "screenshot/cv_api/" + filename, function (err) {

        var endTime = new Date();

        console.log("Elapsed Time = " + (endTime - startTime) + "ms");

        var cvAPILog = new Log({
            url: CV_API_URL,
            startTime: startTime,
            endTime: endTime,
            elapsed: (endTime - startTime)
        });

        cvAPILog.save();

        if (true) {
            var email = {
                subject: 'Connection Alert - ' + CV_API_URL,
                text: "Dear Sir/Madam\n\n" +
                "This is a auto-generated message to alert on connection issue:\n\n" +
                "    URL: " + CV_API_URL + "\n" +
                "    STATUS: unreachable\n" +
                "    TIME: " + startTime + "\n\n" +
                "Please take corresponding action for the connection check.\n\n" +
                "Note: connection issue may be due to poor network connection at host.\n",
                attachment: [
                    {
                        data: "Dear Sir/Madam<br><br>" +
                        "This is an auto-generated message to alert you on the coonection issue.<br><br>" +
                        "   URL: " + CV_API_URL + "<br>" +
                        "   STATUS: unreachable<br>" +
                        "   TIME: " + startTime + "<br>" +
                        "   Elapsed: " + cvAPILog.elapsed + "<br>" +
                        "<br>" +
                        "Please take corresponding action for the connection check.<br>" +
                        "Note: connection issue may be due to poor network connection at host.<br>"

                        , alternative: true
                    },
                    {
                        path: "screenshot/cv_api/" + filename, name: filename
                    }
                ]
            };

            webshooter.send(email, function (err, result) {
                console.log(err || result);
            });

        }


    });

    // Check https://www.google.com.hk/ as benchmark
    webshooter.takeScreenshot(BENCHMARK_URL, "screenshot/benchmark/" + filename, function (err) {

        var endTime = new Date();

        console.log("Elapsed Time = " + (endTime - startTime) + "ms");

        var benchmarkLog = new Log({
            url: BENCHMARK_URL,
            startTime: startTime,
            endTime: endTime,
            elapsed: (endTime - startTime)
        });

        benchmarkLog.save();

        if (true) {
            var email = {
                subject: 'Connection Alert - ' + BENCHMARK_URL,
                text: "Dear Sir/Madam\n\n" +
                "This is a auto-generated message to alert on connection issue:\n\n" +
                "    URL: " + BENCHMARK_URL + "\n" +
                "    STATUS: unreachable\n" +
                "    TIME: " + startTime + "\n\n" +
                "Please take corresponding action for the connection check.\n\n" +
                "Note: connection issue may be due to poor network connection at host.\n",
                attachment: [
                    {
                        data: "Dear Sir/Madam<br><br>" +
                        "This is an auto-generated message to alert you on the coonection issue.<br><br>" +
                        "   URL: " + BENCHMARK_URL + "<br>" +
                        "   STATUS: unreachable<br>" +
                        "   TIME: " + startTime + "<br>" +
                        "   Elapsed: " + benchmarkLog.elapsed + "<br>" +
                        "<br>" +
                        "Please take corresponding action for the connection check.<br>" +
                        "Note: connection issue may be due to poor network connection at host.<br>"

                        , alternative: true
                    },
                    {
                        path: "screenshot/benchmark/" + filename, name: filename
                    }
                ]
            };

            webshooter.send(email, function (err, result) {
                console.log(err || result);
            });

        }


    });

});

console.log("Let's go! " + new Date());