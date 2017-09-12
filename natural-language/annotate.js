#!/usr/bin/env node

const language = require('./clients/language');

const argv = require('yargs')
    .demandOption('t')
    .argv;

const text = argv.t;

const document = {
    type: 1,
    content: text
};

language.analyzeSentiment({document: document}, function (err, response) {
    console.log('language', response.language);
    console.log('annotation', response.documentSentiment);
});
