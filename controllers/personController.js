const PersonModel = require('../models/personModel');
const TransactionModel = require('../models/transactionModel');
const { v4: uuidv4 } = require('uuid');

exports.index = (req, res) => {
    res.render('index');
};

exports.listPeople = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    PersonModel.getAll((people) => {
        const totalPages = Math.ceil(people.length / limit);
        const paginatedPeople = people.slice(offset, offset + limit);
        res.render('listPeople', { people: paginatedPeople, currentPage: page, totalPages });
    });
};

exports.addPerson = (req, res) => {
    if (req.method === 'GET') {
        res.render('addPerson');
    } else if (req.method === 'POST') {
        const person = {
            id: uuidv4(),
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            addedBy: req.session.user.username
        };
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
        const updatedPerson = {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            editedBy: req.session.user.username
        };
        PersonModel.update(id, updatedPerson, () => {
            res.redirect('/list-people');
        });
    }
};

exports.deletePerson = (req, res) => {
    const id = req.params.id;
    if (req.method === 'GET') {
        PersonModel.getById(id, (person) => {
            res.render('deletePerson', { person });
        });
    } else if (req.method === 'POST') {
        PersonModel.delete(id, () => {
            res.redirect('/list-people');
        });
    }
};


exports.viewPerson = (req, res) => {
    const id = req.params.id;
    PersonModel.getById(id, (person) => {
        TransactionModel.getByPersonId(id, (transactions) => {
            res.render('viewPerson', { person, transactions });
        });
    });
};

exports.searchPeoplePage = (req, res) => {
    res.render('searchPeople');
};

exports.searchPeople = (req, res) => {
    const query = req.query.q || '';
    PersonModel.getAll((people) => {
        const filteredPeople = people.filter(person => person.name.toLowerCase().includes(query.toLowerCase()));
        res.render('searchPeople', { people: filteredPeople });
    });
};

