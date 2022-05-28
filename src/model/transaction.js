class Transaction {
    constructor(obj) {
        this.tid = obj.tid,
        this.transactionType = obj.transactionType,
        this.amount = obj.amount,
        this.tDate = obj.tDate
    }
}

module.exports = Transaction;