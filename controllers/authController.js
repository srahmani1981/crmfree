const UserModel = require('../models/userModel');

exports.login = (req, res) => {
    if (req.method === 'GET') {
        res.render('login', { error: '' }); // Ensure error is initialized
    } else if (req.method === 'POST') {
        const { username, password } = req.body;
        UserModel.authenticate(username, password, (user) => {
            if (user) {
                req.session.user = user;
                res.redirect('/');
            } else {
                res.render('login', { error: 'Invalid username or password' });
            }
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
