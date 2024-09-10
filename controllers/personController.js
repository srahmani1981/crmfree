const PersonModel = require('../models/personModel');
const TransactionModel = require('../models/transactionModel');
const { v4: uuidv4 } = require('uuid');

// Index page with monthly donations chart
exports.index = (req, res) => {
    TransactionModel.getAll((transactions) => {
        const monthlyDonations = {};

        // Aggregate donations by month-year
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const month = date.getMonth() + 1; // Get month as 1-12
            const year = date.getFullYear();
            const monthYear = `${year}-${month.toString().padStart(2, '0')}`; // Format as YYYY-MM

            if (!monthlyDonations[monthYear]) {
                monthlyDonations[monthYear] = 0;
            }
            monthlyDonations[monthYear] += transaction.amount; // Sum donations for each month-year
        });

        // Prepare data for the view
        const labels = Object.keys(monthlyDonations).sort(); // Sorted month-year labels
        const data = labels.map(label => monthlyDonations[label]); // Corresponding donation totals

        // Logging for debugging purposes
        console.log('Transactions:', transactions);
        console.log('Monthly Donations:', monthlyDonations);
        console.log('Labels:', labels);
        console.log('Data:', data);

        // Render the index view with the chart data
        res.render('index', { labels, data });
    });
};

// List all people with pagination
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

// Add a new person
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

// Edit an existing person
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

// Delete a person
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

// View a person's details and their transactions
exports.viewPerson = (req, res) => {
    const id = req.params.id;
    PersonModel.getById(id, (person) => {
        TransactionModel.getByPersonId(id, (transactions) => {
            res.render('viewPerson', { person, transactions });
        });
    });
};

// Display search page for people
exports.searchPeoplePage = (req, res) => {
    res.render('searchPeople');
};

// Handle search queries for people
exports.searchPeople = (req, res) => {
    const query = req.query.q || '';
    PersonModel.getAll((people) => {
        const filteredPeople = people.filter(person => person.name.toLowerCase().includes(query.toLowerCase()));
        res.render('searchPeopleResults', { people: filteredPeople });
    });
};

exports.addTransaction = (req, res) => {
    if (req.method === 'GET') {
        const personId = req.params.id;
        PersonModel.getById(personId, (person) => {
            if (person) {
                console.log('Person found:' , person );
                res.render('addTransaction', { person });
            } else {
                console.log('Person not found');
                res.redirect('/list-people');
            }
        });
    } else if (req.method === 'POST') {
        const transaction = {
            id: uuidv4(),
            personId: req.params.id,
            amount: req.body.amount,
            date: req.body.date,
            addedBy: req.session.user.username
        };

        TransactionModel.add(transaction, (err) => {
            if (err) {
                console.error('Error adding transaction:', err);
                res.redirect(`/view-person/${req.params.id}`);
            } else {
                res.redirect(`/view-person/${req.params.id}`);
            }
        });
    }
};