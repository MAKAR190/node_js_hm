const path = require("path");
const fs = require("fs").promises;
const contactsPath = path.join(__dirname + "/db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath)
    .then((res) => console.log(JSON.parse(res)))
    .catch(() => console.log("smth went wrong..."));
}

function getContactById(contactId) {
  fs.readFile(contactsPath)
    .then((res) => {
      const data = JSON.parse(res);
      const contact = data.find((contact) => contact.id === contactId);
      if (!contact) {
        console.log("Contact is not defined...");
      } else {
        console.log(contact);
      }
    })
    .catch(() => console.log("smth went wrong..."));
}

function removeContact(contactId) {
  fs.readFile(contactsPath)
    .then((res) => {
      const data = JSON.parse(res);
      const result = data.filter((contact) => contact.id !== contactId);

      fs.writeFile(contactsPath, JSON.stringify(result));
      console.log(JSON.stringify(result));
    })
    .catch(() => console.log("smth went wrong..."));
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath)
    .then((res) => {
      const data = JSON.parse(res);
      const newContact = {
        id: data.length + 1,
        name: name,
        email: email,
        phone: phone,
      };
      data.push(newContact);
      fs.writeFile(contactsPath, JSON.stringify(data));
      console.log(newContact);
    })
    .catch(() => console.log("smth went wrong..."));
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
