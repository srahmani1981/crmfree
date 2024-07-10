const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/organizations.txt');

class OrganizationModel {
    static getAll(callback) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) throw err;
            const organizations = data ? JSON.parse(data) : [];
            callback(organizations);
        });
    }

    static add(organization, callback) {
        this.getAll((organizations) => {
            organizations.push(organization);
            fs.writeFile(filePath, JSON.stringify(organizations, null, 2), (err) => {
                if (err) throw err;
                callback();
            });
        });
    }

    static getById(id, callback) {
        this.getAll((organizations) => {
            const organization = organizations.find(o => o.id === id);
            callback(organization);
        });
    }

    static update(id, updatedOrganization, callback) {
        this.getAll((organizations) => {
            const index = organizations.findIndex(o => o.id === id);
            if (index !== -1) {
                organizations[index] = { ...updatedOrganization, id };
                fs.writeFile(filePath, JSON.stringify(organizations, null, 2), (err) => {
                    if (err) throw err;
                    callback();
                });
            } else {
                callback(new Error('Organization not found'));
            }
        });
    }

    static delete(id, callback) {
        this.getAll((organizations) => {
            const updatedOrganizations = organizations.filter(o => o.id !== id);
            fs.writeFile(filePath, JSON.stringify(updatedOrganizations, null, 2), (err) => {
                if (err) throw err;
                callback();
            });
        });
    }
}

module.exports = OrganizationModel;

