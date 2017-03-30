const PubSub = require('@google-cloud/pubsub');

const pubsubClient = PubSub({
    projectId: 'serverlezz',
    keyFilename: 'keyfile.json'
});

module.exports = pubsubClient;
