#!/usr/bin/env node

const pubsub = require('./pubsub');

const argv = require('yargs')
    .demandOption('t')
    .argv;

const topic = argv.t;

pubsub.createTopic(topic)
    .then((results) => {
        const topic = results[0];
        console.log(`Topic ${topic.name} created.`);
    });
