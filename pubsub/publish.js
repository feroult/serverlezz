#!/usr/bin/env node

const pubsub = require('./clients/pubsub');

const argv = require('yargs')
    .demandOption('t')
    .demandOption('d')
    .argv;

const topicName = argv.t;
const data = argv.d;

const topic = pubsub.topic(topicName);

return topic.publish(data)
    .then((results) => {
        const messageIds = results[0];
        console.log(`Message ${messageIds[0]} published.`);
        return messageIds;
    });
