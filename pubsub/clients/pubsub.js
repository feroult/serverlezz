const PubSub = require('@google-cloud/pubsub');

const pubsubClient = PubSub({
    projectId: 'ratecard-1470747960702',
    keyFilename: 'keyfile.json'
});

module.exports = pubsubClient;
