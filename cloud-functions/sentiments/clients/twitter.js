const Twit = require('twit');

module.exports = new Twit({
    consumer_key: 'CTE8oHZLszXxfUslMUq1WHkzA',
    consumer_secret: 'RISTBYBVdIfcEpq9uF3jwxjr01ao7PmICSjxWCNIDgP9MM0C7a',
    access_token: '215226008-jWx9ibsTgKaP5tApG7weTflGZ1xCoaL09h8JG1Xl',
    access_token_secret: 'IgUm0JbceLDUgJe1xsV6uIztQh1B3H8Zrsc9lsizqirsF',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});
