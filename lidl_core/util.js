module.exports = {
        sendMessage: sendMessage
}

let client = require('../lidl_core/client.js');
// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
        if (context['message-type'] === 'whisper') {
                client.chat.whisper(target, message)
        } else {
                client.chat.say(target, message)
        }
}

