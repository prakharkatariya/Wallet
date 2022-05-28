const initialData = require("./data.json")
const connection = require("../utilities/connection")

let createConnection = async() => {
    collection = await connection.getCollection();
}

let model = {}
model.insertScript = async() => {
    await collection.deleteMany();
    let response = await collection.insertMany(initialData);
    if (response && response.length > 0) {
        return response.length
    } else {
        let err = new Error("Script insertion failed")
        err.status = 500
        throw new Error
    }
}

model.generateId = async() => {

    let tid = await collection.distinct("transaction.tid")
    let newId = Math.max(...tid)
    return newId > 0 ? newId + 1 : 1001
}

model.getUser = async(username) => {
    let userData = await collection.findOne({ username: username }, { _id: 0, username: 1, password: 1 })
    return userData;
}

model.createAccount = async(accountObj) => {
    let accountData = await collection.create(accountObj)
    return accountData ? true : false;
}

model.getTransactions = async(username) => {

    let transactionData = await collection.findOne({ username: username }, { _id: 0, transactions: 1 });
    return transactionData;
}

model.updateTransactions = async(username, transactionObj) => {
    let tid = await model.generateId()
    transactionObj.tid = tid;
    let response = await collection.updateOne({ username: username }, { $push: { transactions: transactionObj } }, { runValidators: true })
    if (response.nModified > 0)
        return transactionObj.tid
    else
        return null
}

model.deleteTransaction = async(username, tid) => {
    let responseData = await collection.updateOne({ username: username }, { $pull: { transactions: { tid: tid } } }, { runValidators: true });
    if (responseData.nModified > 0) return tid
    else return null
}

createConnection();
module.exports = model