/**
 * Created by kinnimew on 10/8/15.
 */

module.exports = {
    mongodb: {
        host: "localhost",
        username: "root",
        password: "bitnami",
        database: "cityuwebmon"
    },
    smtp: {
        host: "smtp.sendgrid.net",
        username: 'azure_406a31418a4f11d2b6a1ceb61f2ee5d8@azure.com',
        password: '3YnaF9yte4ozQPO'
    },
    senderAddress: 'noreply@appslab.hk',
    recipients: ['hoyeungjasonliu@gmail.com', 'kinni.mew@gmail.com'],
    interval: 1 // minute, the smallest interval is 1 minute
}