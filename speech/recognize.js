let commands = false;

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
        interimResults: true,
        singleUtterance: commands
    };

    // Create a recognize stream
    let stopped = false;

    function stop() {
        if (stopped) {
            return;
        }
        stopped = true;
        record.stop();
        loop();
    }

    function toggleCommands(transcript) {
        if (transcript.toLowerCase().indexOf('habilitar comando') != -1 && !commands) {
            console.log('enabling commands...');
            commands = true;
            stop();
        } else if (transcript.toLowerCase().indexOf('desabilitar comando') != -1 && commands) {
            console.log('disabling commands...');
            commands = false;
            stop();
        }
    }

    const recognizeStream = speech.streamingRecognize(request)
        .on('error', console.error)
        .on('data', (data) => {
            const result = data.results[0] && data.results[0];

            if (!result || !result.alternatives || result.alternatives.length === 0) {
                // stop();
                return;
            }

            const alternative = result.alternatives[0];
            // console.log('data', data, alternative);
            console.log(`final=${result.isFinal}, transcription: ${alternative.transcript}`);
            toggleCommands(alternative.transcript);
            send(alternative.transcript, result.isFinal);

            if (result.isFinal && commands) {
                stop();
            }
        })
        .on('end', () => {
            stop();
        });


    // Start recording and send the microphone input to the Speech API
    record
        .start({
            sampleRateHertz: sampleRateHertz,
            threshold: 0,
            // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
            // verbose: true,
            recordProgram: 'rec', // Try also "arecord" or "sox"
            silence: '0:02.000',
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


// loop

let timeout;

function restart() {
    if (timeout) {
        clearTimeout(timeout);
    }
    record.stop();
    loop();
}

function loop() {
    recordStart();
    // timeout = setTimeout(() => {
    //     record.stop();
    //     loop();
    // }, 60 * 1000);
}

loop();
