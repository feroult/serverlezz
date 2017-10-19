const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const apiai = require('./apiai-client');

function askForCommand(subId, text) {
    return new Promise((resolve, reject) => {
        var request = apiai.textRequest(text, {
            sessionId: subId
        });

        request.on('response', function (response) {
            console.log('resp', response);
            resolve(response);
        });

        request.on('error', function (error) {
            console.log('err', error);
            reject(error);
        });

        request.end();
    });
}

exports.detectCommands = functions.database.ref('/subtitles/{subId}')
    .onWrite(event => {
        const subId = event.params.subId;
        const text = event.data.val().text;
        const isFinal = event.data.val().isFinal;

        if (!isFinal) {
            return Promise.resolve();
        }

        return askForCommand(subId, text).then((response) => {
            if (response.result.action === 'input.unknown') {
                return;
            }

            const action = response.result.fulfillment.messages[0].payload.action;
            const params = response.result.parameters;

            const ref = event.data.ref.parent.parent.child('commands').push();
            return ref.set({
                action: action,
                params: params
            });
        });
    });