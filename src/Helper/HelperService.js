// myClass.js
const { v4: uuidv4 } = require('uuid');

class HelperService {
     getNewUUID() {
        return uuidv4();
    }
}

module.exports = HelperService;