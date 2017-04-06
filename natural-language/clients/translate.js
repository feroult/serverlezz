var language = require('@google-cloud/translate')({
    projectId: 'serverlezz',
    keyFilename: 'keyfile.json'
});

module.exports = language;
