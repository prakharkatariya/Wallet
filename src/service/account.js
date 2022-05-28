const dbLayer = require("../model/account")
const validator = require("../utilities/validator")

let service = {}

service.insertScript = async() => {
    let data = await dbLayer.insertScript();
    return data;
}

service.validateLogin = async(loginObj) => {
    let response = await dbLayer.getUser(loginObj.username); 
    if (!response) {
        let err = new Error("User does not exist")
        err.status = 401
        throw err
    } else if (response.password != loginObj.password) { 
        let err = new Error("Incorrect password")
        err.status = 401
        throw err
    } else {
        return true
    }
}

service.getTransactions = async(username) => {
    let data = await dbLayer.getTransactions(username)
    if (data && data.transactions.length > 0) {
        return data.transactions
    } else {
        let err = new Error("No transaction details found")
        err.status = 404
        throw err
    }
}

service.createAccount = async(accountObj) => {
    validator.validatePAN(accountObj.PAN);
    let data = await dbLayer.getUser(accountObj.username);
    if (data) {
        let err = new Error("User already exists")
        err.status = 406
        throw err
    } else {
        let accountData = await dbLayer.createAccount(accountObj);
        if (accountData) {
            return accountData
        } else {
            let err = new Error("Account not created")
            err.status = 500
            throw err;
        }
    }
}

service.updateTransactions = async(username, transactionObj) => {
    let tid = await dbLayer.updateTransactions(username, transactionObj);
    if (tid) {
        return tid
    } else {
        let err = new Error("Transaction details not updated")
        err.status = 400
        throw err
    }
}

service.deleteTransaction = async(username, tid) => {
    let resp = await dbLayer.deleteTransaction(username, tid);
    if (resp) return resp
    else {
        let err = new Error("No transaction details found or operation failed");
        err.status = 500;
        throw err;
    }
}


module.exports = service