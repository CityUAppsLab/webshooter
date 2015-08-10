/**
 * Created by kinnimew on 10/8/15.
 */

module.exports = {
    url: "the-url-your-want-to-monitor",
    smtp: {
        host: "your-smtp-host",
        username: 'your-smtp-username',
        password: 'your-smtp-password'
    },
    senderAddress: 'your-sender-address',
    recipients: ['your-recipients'],
    interval: 1 // minute, the smallest interval is 1 minute
}