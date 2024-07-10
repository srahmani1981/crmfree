const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/people.txt');

class PersonModel {
    static getAll(callback) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;
            const people = data ? JSON.parse(data) : [];
            callback(people);
        });
    }

    static add(person, callback) {
        this.getAll((people) => {
            people.push(person);
            fs.writeFile(filePath, JSON.stringify(people, null, 2), (err) => {
                if (err) throw err;
                callback();
            });
        });
    }

    static getById(id, callback) {
        this.getAll((people) => {
            const person = people.find(p => p.id === id);
            callback(person);
        });
    }

    static update(id, updatedPerson, callback) {
        this.getAll((people) => {
            const index = people.findIndex(p => p.id === id);
            if (index !== -1) {
                people[index] = { ...updatedPerson, id };
                fs.writeFile(filePath, JSON.stringify(people, null, 2), (err) => {
                    if (err) throw err;
                    callback();
                });
            } else {
                callback(new Error('Person not found'));
            }
        });
    }

    static delete(id, callback) {
        this.getAll((people) => {
            const updatedPeople = people.filter(p => p.id !== id);
            fs.writeFile(filePath, JSON.stringify(updatedPeople, null, 2), (err) => {
                if (err) throw err;
                callback();
            });
        });
    }
}

module.exports = PersonModel;

