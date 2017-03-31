#!/usr/bin/env node

const pubsub = require('./clients/pubsub');

const argv = require('yargs')
    .demandOption('t')
    .demandOption('s')
    .argv;

const topicName = argv.t;
const subscriptionName = argv.s;

const topic = pubsub.topic(topicName);

return topic.subscribe(subscriptionName)
    .then((results) => {
        const subscription = results[0];
        console.log(`Subscription ${subscription.name} created.`);
        return subscription;
    });
