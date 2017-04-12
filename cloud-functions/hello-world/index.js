exports.helloWorld = function (req, res) {
    const name = req.query.name || 'all';
    res.status(200).send('hello world, ' + name);
};
