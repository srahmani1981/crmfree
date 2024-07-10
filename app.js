const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const personController = require('./controllers/personController');
const organizationController = require('./controllers/organizationController');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', personController.index);
app.get('/list-people', personController.listPeople);
app.get('/add-person', personController.addPerson);
app.post('/add-person', personController.addPerson);
app.get('/edit-person/:id', personController.editPerson);
app.post('/edit-person/:id', personController.editPerson);
app.get('/delete-person/:id', personController.deletePerson);
app.get('/view-person/:id', personController.viewPerson);

app.get('/list-organizations', organizationController.listOrganizations);
app.get('/add-organization', organizationController.addOrganization);
app.post('/add-organization', organizationController.addOrganization);
app.get('/edit-organization/:id', organizationController.editOrganization);
app.post('/edit-organization/:id', organizationController.editOrganization);
app.get('/delete-organization/:id', organizationController.deleteOrganization);
app.get('/view-organization/:id', organizationController.viewOrganization);

const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

