const axios = require('axios');
const { EVENT_KEYS } = require('../../src/enums');

const prOpened = require('../../src/actions/gChat/prOpened');
const commentAdded = require('../../src/actions/gChat/commentAdded');

exports.handler = async function(event, context) {
  const G_CHAT_URL = process.env.G_CHAT_URL;

  const body = JSON.parse(event.body);

  const createPayloadBasedEvent = (payload) => {
    switch (payload.eventKey) {
      case EVENT_KEYS.OPENED:
        return prOpened(payload)
      case EVENT_KEYS.COMMENT_ADDED:
        return commentAdded(payload)
      default:
        return {
          message: 'Event not supported'
        }
    }
  };

  await axios.post(G_CHAT_URL, createPayloadBasedEvent(body))

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Sent successfully' })
  }
}

