const express = require('express');
const routing = express.Router();
const service = require("../service/account");
const Transaction = require("../model/transaction")


routing.get("/setupDB", async(req, res, next) => {
    try {
        let data = await service.insertScript();
        if (data) {
            res.status(201)
            res.json({ message: "Inserted " + data + " document in database" })
        }
    } catch (err) { next(err) }
})


//Routing for login
routing.post("/login", async(req, res, next) => {
    let loginObj = req.body
    try {
        let resp = await service.validateLogin(loginObj);
        if (resp) {
            res.status(200)
            res.json({ message: "Logged in Successfully as : " + loginObj.username })
        }
    } catch (err) { next(err) }
})


//---------------------------------------------------------------------------------------


//Routing to get transactions details 
routing.get('/transactions/:username', async(req, res, next) => {
    let username = req.params.username;
    try {
        let transactionDetails = await service.getTransactions(username)
        res.status(200)
        res.json(transactionDetails)
    } catch (err) {
        next(err)
    }
})


//---------------------------------------------------------------------------------------

//Routing to create new account for user 
routing.post("/accounts", async(req, res, next) => {
    let accountObj = req.body
    try {
        let accountData = await service.createAccount(accountObj);
        res.json({ message: "Account Created Successfully" })
    } catch (err) { next(err) }
})

//---------------------------------------------------------------------------------------

//Routing to update transactions
routing.put("/transactions/:username", async(req, res, next) => {
    let transactionObj = new Transaction(req.body)
    let username = req.params.username
    try {
        let tid = await service.updateTransactions(username, transactionObj)
        res.json({ message: "Transaction updated with id : " + tid })
    } catch (err) { next(err) }
})

//---------------------------------------------------------------------------------------

//Routing to delete transactions
routing.delete("/transactions/:username/:tid", async(req, res, next) => {


    let username = req.params.username
    let tid = Number(req.params.tid)
    try {
        let tid = await service.deleteTransaction(username, tid);
        res.json({ message: "Removed transaction with Id : " + tid })
    } catch (err) { next(err) }
})

module.exports = routing;