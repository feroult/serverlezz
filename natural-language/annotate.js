#!/usr/bin/env node

const util = require('util');
const language = require('./clients/language');

const argv = require('yargs')
    .demandOption('t')
    .argv;

const text = argv.t;

const document = {
    type: 1,
    content: text
};

const features = {
    extractSyntax: true,
    extractEntities: true,
    extractDocumentSentiment: true,
    extractEntitySentiment: false
};

const request = {
    document: document,
    features: features
};

language.annotateText(request)
    .then(function (response) {
        log(response);
    })
    .catch(function (err) {
        log(err);
    });

function log(object) {
    console.log(util.inspect(object, {showHidden: false, depth: null}))
}