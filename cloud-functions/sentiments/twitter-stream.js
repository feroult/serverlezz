#!/usr/bin/env node

const argv = require('yargs')
    .argv;


const request = require('request');
const T = require('./clients/twitter');

const stream = T.stream('statuses/sample', {language: 'pt'});

stream.on('tweet', (tweet) => {
    var text = tweet.text;

    if (text.includes('RT ') || text.includes('http') || text.startsWith('@')) {
        return;
    }

    const options = {
        qs: {
            msisdn: 'twitter',
            text: text,
            to: 'twitter'
        }
    };

    if (!argv.f) {
        request.get('https://us-central1-serverlezz.cloudfunctions.net/smsNL', options, (err, res) => {
            if (res.statusCode === 200) {
                console.log(`Tweet: '${text}'`);
            } else {
                console.error('error', err);
            }
        });
    } else {
        console.log('flushing', text);
    }


});

