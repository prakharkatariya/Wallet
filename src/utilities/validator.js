let validator = {}

validator.validateDate = (tDate) => {
    if (new Date(tDate) > new Date()) {
        let err = new Error("Transaction date cannot be future date")
        err.status = 406 //Not acceptable
        throw err
    }
}

validator.validatePAN = (PAN) => {
    if (!PAN.match(/^[A-Z]{5}[0-9]{4}[A-Z]$/)) {
        let err = new Error("Invalid PAN number")
        err.status = 406
        throw err
    }
}

module.exports = validator