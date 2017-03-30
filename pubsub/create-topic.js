#!/usr/bin/env node

const pubsubClient = require('./pubsub');

const argv = require('yargs')
    .usage('Usage: $0 -t [topic]')
    .demandOption('t')
    .argv;

const topic = argv.t;

pubsubClient.createTopic(topic)
    .then((results) => {
        const topic = results[0];
        console.log(`Topic ${topic.name} created.`);
    })
    .catch(err => {
        console.log('err', err);
    });