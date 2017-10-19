// speech init
const record = require('node-record-lpcm16');
const Speech = require('@google-cloud/speech');

const speech = Speech({
    projectId: 'serverlezz',
    keyFilename: 'keyfile.json'
});

// firebase init
const firebase = require('firebase-admin');
const serviceAccount = require('./keyfile.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://serverlezz.firebaseio.com'
});

function recordStart() {
    const encoding = 'LINEAR16';
    const sampleRateHertz = 16000;
    const languageCode = 'pt_BR';

    const request = {
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
            // enableWordTimeOffsets: true
            // profanityFilter: true
        },
        interimResults: true
    };

    // Create a recognize stream
    const recognizeStream = speech.streamingRecognize(request)
        .on('error', console.error)
        .on('data', (data) => {
            const result = data.results[0] && data.results[0];
            const alternative = result.alternatives[0];
            if (alternative) {
                console.log('data', data, alternative);
                console.log(`Transcription: ${alternative.transcript}`);
                send(alternative.transcript, result.isFinal);
            } else {
                console.log(`\n\nReached transcription time limit, press Ctrl+C`);
            }
        });

    // Start recording and send the microphone input to the Speech API
    record
        .start({
            sampleRateHertz: sampleRateHertz,
            threshold: 0,
            // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
            verbose: false,
            recordProgram: 'rec', // Try also "arecord" or "sox"
            silence: '10.0'
        })
        .on('error', console.error)
        .pipe(recognizeStream);

    console.log('Listening, press Ctrl+C to stop.');

}

function send(text, isFinal) {
    const ref = firebase.database().ref('subtitles').push();
    ref.set({
        text: text,
        isFinal: isFinal
    });
}


function loop() {
    recordStart();
    setTimeout(() => {
        record.stop();
        loop();
    }, 60 * 1000);
}

loop();
