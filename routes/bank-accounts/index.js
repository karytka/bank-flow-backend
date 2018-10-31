const express = require('express');
const router = express.Router();

const models = require('../../models');
const validateRequestSchema = require('../../helpers/http/request-schema-validator');
const VALIDATION_SCHEMAS = require('./validation-schemas');


router.get('/cashbox', [
  validateRequestSchema(VALIDATION_SCHEMAS.FETCH_CASHBOX),
  (req, res) => {
    return models.BankAccount.fetchCashboxAccount(req.query)
    .then(cities => res.status(200).json(cities))
    .catch(err => res.status(400).json(err))
  }
]);


module.exports = router;