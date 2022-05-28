const mongoose = require("mongoose")
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema
mongoose.set("useCreateIndex", true)
const url = 'mongodb://localhost:27017/ExpressWalletDB'
let schema = {
    "username": {
        type: String,
        required: true,
        unique: true
    },
    "password": {
        type: String,
        required: true
    },
    "PAN": {
        type: String,
        required: true
    },
    "transactions": {
        type: [{
            "tid": {
                type: Number,
                required: true
            },
            "amount": {
                type: Number,
                min: 100,
                required: true
            },
            "transactionType": {
                type: String,
                required: true
            },
            "tDate": {
                type: Date,
                required: true
            }
        }],
        default: []
    }
}
let accountSchema = new Schema(schema, { collection: "Account", timestamps: true })
let connection = {}
connection.getCollection = async() => {
    try {
       return (await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })).model("Account", accountSchema)
    } catch (err) {
        let error = new Error("Could not connect to database")
        error.status = 500
        throw error
    }
}
module.exports = connection
