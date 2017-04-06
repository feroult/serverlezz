var language = require('@google-cloud/language')({
    projectId: 'serverlezz',
    keyFilename: 'keyfile.json'
});

module.exports = language;
