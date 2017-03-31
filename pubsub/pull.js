#!/usr/bin/env node

const pubsub = require('./clients/pubsub');

const argv = require('yargs')
    .demandOption('s')
    .argv;

const subscriptionName = argv.s;

const subscription = pubsub.subscription(subscriptionName);

return subscription.pull()
    .then((results) => {
        const messages = results[0];

        console.log(`Received ${messages.length} messages.`);

        messages.forEach((message) => {
            console.log(`* %d %j %j`, message.id, message.data, message.attributes);
        });

        // Acknowledges received messages. If you do not acknowledge, Pub/Sub will
        // redeliver the message.
        return subscription.ack(messages.map((message) => message.ackId));
    });