#!/usr/bin/env node

const argv = require('yargs')
    .demandOption('t')
    .argv;

const topicName = argv.t;

const T = require('./clients/twitter');
const pubsub = require('./clients/pubsub');

const stream = T.stream('statuses/sample', {language: 'pt'});

stream.on('tweet', (tweet) => {
    const topic = pubsub.topic(topicName);
    return topic.publish(tweet)
        .then((results) => {
            const messageIds = results[0];
            console.log(`Message '${tweet.text}' published.`);
            return messageIds;
        });
});

