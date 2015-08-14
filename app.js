/**
 * Created by kinnimew on 10/8/15.
 */
var config = require('./config');

var fs = require('fs');

var webshooter = require('./webshooter');

var dateFormat = require('dateformat');
var schedule = require('node-schedule');
var csv = require('fast-csv');
var async = require('async');

var mongoose = require('mongoose');


var Log = mongoose.model('Log', {
    url: {type: String},
    startTime: {type: Date},
    endTime: {type: Date},
    elapsed: {type: Number},
    result: {type: String, enum: ['pass', 'fail']}
});

var CV_HOME_URL = 'https://compassvisa.com.hk';
var CV_API_URL = 'https://www.compassvisa.com.hk/iphoneapi/getLoginUserInfo.ashx';
var BENCHMARK_URL = 'google.com';

mongoose.connect('mongodb://' +
    config.mongodb.username + ":" +
    config.mongodb.password + "@" +
    config.mongodb.host + "/" +
    config.mongodb.database,
    function (err) {
        console.log(err || "mongodb connection OK");

        setUpAvailabilityTest();
        setupDailySummary();

    }
);

function setUpAvailabilityTest() {
    console.log("setUpAvailabilityTest");

    var interval = '*/' + config.interval + ' * * * *';


    // Availablilty Test
    schedule.scheduleJob(interval, function () {

        var startTime = new Date();

        var filename = dateFormat(startTime, 'yyyymmddHHMM') + '.png';

        var webshooterCallback = function (err, url) {
            var endTime = new Date();

            var log = new Log({
                url: url,
                startTime: startTime,
                endTime: endTime,
                elapsed: (endTime - startTime),
                result: (err) ? 'fail' : 'pass'
            });

            log.save();
            if (err) {
                var email = {
                    subject: 'Connection Alert - ' + url,
                    text: "Dear Sir/Madam\n\n" +
                    "This is a auto-generated message to alert on connection issue:\n\n" +
                    "    URL: " + url + "\n" +
                    "    STATUS: unreachable\n" +
                    "    TIME: " + startTime + "\n\n" +
                    "Please take corresponding action for the connection check.\n\n" +
                    "Note: connection issue may be due to poor network connection at host.\n",
                    attachment: [
                        {
                            data: "Dear Sir/Madam<br><br>" +
                            "This is an auto-generated message to alert you on the coonection issue.<br><br>" +
                            "   URL: " + url + "<br>" +
                            "   STATUS: unreachable<br>" +
                            "   TIME: " + startTime + "<br>" +
                            "   Elapsed: " + log.elapsed + "<br>" +
                            "<br>" +
                            "Please take corresponding action for the connection check.<br>" +
                            "Note: connection issue may be due to poor network connection at host.<br>"

                            , alternative: true
                        }
                    ]
                };

                webshooter.send(email, function (err, result) {
                    if (err) console.log(err);
                });

            }


        }

        // Check https://compassvisa.com.hk
        webshooter.takeScreenshot(CV_HOME_URL, "screenshot/cv_home/" + filename, webshooterCallback);

        // Check https://www.compassvisa.com.hk/iphoneapi/getLoginUserInfo.ashx
        webshooter.takeScreenshot(CV_API_URL, "screenshot/cv_api/" + filename, webshooterCallback);

        // Check https://www.google.com.hk/ as benchmark
        webshooter.takeScreenshot(BENCHMARK_URL, "screenshot/benchmark/" + filename, webshooterCallback);
    });
}


function setupDailySummary() {
    console.log("setupDailySummary");

    var rule = new schedule.RecurrenceRule();
    rule.hour = config.dailySummaryAt.hour;
    rule.minute = config.dailySummaryAt.minute;

    schedule.scheduleJob(rule, function () {
        sendDailySummary();
    });
}


function sendDailySummary() {

    async.waterfall([
        function (callback) {

            loadResultToCsv(BENCHMARK_URL, "benchmark.csv", function () {
                callback(null);
            });
        },
        function (callback) {
            loadResultToCsv(CV_HOME_URL, "cv_home.csv", function () {
                callback(null);
            });
        },
        function (callback) {
            loadResultToCsv(CV_API_URL, "cv_api.csv", function () {
                callback(null);
            })
        }
    ], function (err, result) {

        if (err) console.log(err);

        var email = {
            to: config.recipients,
            subject: "Summary on CV pages/API response",
            text: "Dear Sir/Madam,\nThis is a auto-generated message on daily summary. ",
            attachment: [
                {path: "csv/benchmark.csv", name: "benchmark.csv"},
                {path: "csv/cv_home.csv", name: "cv_home.csv"},
                {path: "csv/cv_api.csv", name: "cv_api.csv"}
            ]
        };

        webshooter.send(email, function (err, message) {
            if (err) console.log(err);
        });

    });


}

function loadResultToCsv(url, filename, callback) {

    var date = new Date();
    date.setDate(date.getDate() - 1);

    Log.find({
        startTime: {$gte: date},
        url: url
    }, function (err, logs) {

        var csvStream = csv.createWriteStream({headers: ["url", "startTime", "endTime", "elapsed"]}),
            writableStream = fs.createWriteStream("csv/" + filename);

        writableStream.on("finish", function () {
            callback();
        });

        csvStream.pipe(writableStream);

        var sum = 0;
        var max = logs[0].elapsed;
        var min = logs[0].elapsed;
        logs.forEach(function (log) {

            sum += log.elapsed;
            if (log.elapsed > max) {
                max = log.elapsed;
            }

            if (log.elapsed < min) {
                min = log.elapsed;
            }

            log = log.toObject();

            log.startTime = dateFormat(log.startTime, "yyyy-mm-dd HH:MM:ss");
            log.endTime = dateFormat(log.endTime, "yyyy-mm-dd HH:MM:ss");

            csvStream.write(log);
        });

        csvStream.write("\n");
        csvStream.write("\n");
        csvStream.write({"url": "Average elapsed time = " + Math.floor(sum / logs.length) + " ms"});
        csvStream.write({"url": "Max elapsed time = " + max + " ms"});
        csvStream.write({"url": "Min elapsed time = " + min + " ms"});

        csvStream.end();
    });
}


console.log("Let's go! " + new Date());
