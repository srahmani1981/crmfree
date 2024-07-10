const OrganizationModel = require('../models/organizationModel');
const { v4: uuidv4 } = require('uuid');

exports.listOrganizations = (req, res) => {
    OrganizationModel.getAll((organizations) => {
        res.render('organizations/listOrganizations', { organizations });
    });
};

exports.addOrganization = (req, res) => {
    if (req.method === 'GET') {
        res.render('organizations/addOrganization');
    } else if (req.method === 'POST') {
        const organization = {
            id: uuidv4(),
            name: req.body.name,
            addedBy: req.session.user.username
        };
        OrganizationModel.add(organization, () => {
            res.redirect('/list-organizations');
        });
    }
};

exports.editOrganization = (req, res) => {
    const id = req.params.id;
    if (req.method === 'GET') {
        OrganizationModel.getById(id, (organization) => {
            res.render('organizations/editOrganization', { organization });
        });
    } else if (req.method === 'POST') {
        const updatedOrganization = {
            name: req.body.name,
            editedBy: req.session.user.username
        };
        OrganizationModel.update(id, updatedOrganization, () => {
            res.redirect('/list-organizations');
        });
    }
};

exports.deleteOrganization = (req, res) => {
    const id = req.params.id;
    if (req.method === 'GET') {
        OrganizationModel.getById(id, (organization) => {
            res.render('organizations/deleteOrganization', { organization });
        });
    } else if (req.method === 'POST') {
        OrganizationModel.delete(id, () => {
            res.redirect('/list-organizations');
        });
    }
};

exports.viewOrganization = (req, res) => {
    const id = req.params.id;
    OrganizationModel.getById(id, (organization) => {
        res.render('organizations/viewOrganization', { organization });
    });
};

