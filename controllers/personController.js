const PersonModel = require('../models/personModel');
const { v4: uuidv4 } = require('uuid');

exports.index = (req, res) => {
    res.render('index');
};

exports.listPeople = (req, res) => {
    PersonModel.getAll((people) => {
        res.render('listPeople', { people });
    });
};

exports.addPerson = (req, res) => {
    if (req.method === 'GET') {
        res.render('addPerson');
    } else if (req.method === 'POST') {
        const person = { id: uuidv4(), name: req.body.name, age: req.body.age, email: req.body.email };
        PersonModel.add(person, () => {
            res.redirect('/list-people');
        });
    }
};

exports.editPerson = (req, res) => {
    const id = req.params.id;
    if (req.method === 'GET') {
        PersonModel.getById(id, (person) => {
            res.render('editPerson', { person });
        });
    } else if (req.method === 'POST') {
        const updatedPerson = { name: req.body.name, age: req.body.age, email: req.body.email };
        PersonModel.update(id, updatedPerson, () => {
            res.redirect('/list-people');
        });
    }
};

exports.deletePerson = (req, res) => {
    const id = req.params.id;
    PersonModel.delete(id, () => {
        res.redirect('/list-people');
    });
};

exports.viewPerson = (req, res) => {
    const id = req.params.id;
    PersonModel.getById(id, (person) => {
        res.render('viewPerson', { person });
    });
};

