exports.helloWorld = function (req, res) {
    const message = req.query.name || 'all';
    res.status(200).send('hello world, ' + message);
};
