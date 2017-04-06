#!/usr/bin/env node

const translate = require('./clients/translate');
const language = require('./clients/language');

const argv = require('yargs')
    .demandOption('t')
    .argv;

const text = argv.t;

translate.translate(text, {from: 'pt-BR', to: 'en'})
    .then((results) => {
            const translation = results[0];

            console.log(`Text: ${text}`);
            console.log(`Translation: ${translation}`);

            language.annotate(translation, {verbose: true}, function (err, annotation) {
                console.log('annotation', annotation.sentiment);
            });
        }
    );
