const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const personController = require('./controllers/personController');
const organizationController = require('./controllers/organizationController');
const authController = require('./controllers/authController');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

// Middleware to pass session to views
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/login', authController.login);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

app.get('/', authMiddleware, personController.index);
app.get('/list-people', authMiddleware, personController.listPeople);
app.get('/add-person', authMiddleware, personController.addPerson);
app.post('/add-person', authMiddleware, personController.addPerson);
app.get('/edit-person/:id', authMiddleware, personController.editPerson);
app.post('/edit-person/:id', authMiddleware, personController.editPerson);
app.get('/delete-person/:id', authMiddleware, personController.deletePerson);
app.get('/view-person/:id', authMiddleware, personController.viewPerson);
app.get('/search-people', authMiddleware, personController.searchPeople);

app.get('/list-organizations', authMiddleware, organizationController.listOrganizations);
app.get('/add-organization', authMiddleware, organizationController.addOrganization);
app.post('/add-organization', authMiddleware, organizationController.addOrganization);
app.get('/edit-organization/:id', authMiddleware, organizationController.editOrganization);
app.post('/edit-organization/:id', authMiddleware, organizationController.editOrganization);
app.get('/delete-organization/:id', authMiddleware, organizationController.deleteOrganization);
app.post('/delete-organization/:id', authMiddleware, organizationController.deleteOrganization);
app.get('/view-organization/:id', authMiddleware, organizationController.viewOrganization);
app.get('/search-organizations', authMiddleware, organizationController.searchOrganizations);

const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

