const Promise = require('bluebird');

const models = require('../../../index');
const { sequelize } = models;

const { ACCOUNT_TYPE } = require('../../../../helpers/common-constants/constants');
const { AMOUNT_ACTION: { INCREASE, DECREASE }, DAYS_IN_YEAR } = require('../../../../helpers/common-constants/constants');
const { manipulateBankAccountAmount } = require('../common-operations');


/**
 * Transfer all creditId's money to cashbox.
 *
 * @param creditId
 * @param options
 * @returns {*}
 */
const transferAllToCashboxFromRaw = ({ creditId }, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    console.log(creditId);
    return Promise.join(
      models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction }),
      models.Credit.fetchById(creditId, {
        ...options,
        include: [{
          model: models.BankAccount,
          as: 'rawBankAccount',
          attributes: ['id', 'amount'],
          required: true
        }],
        transaction
      })
    )
    .spread((cashboxBankAccount, credit) => {
      const { rawBankAccount } = credit;

      return Promise.all([
        manipulateBankAccountAmount(
          INCREASE,
          { id: cashboxBankAccount.id, amount: rawBankAccount.amount },
          { ...options, transaction }
        ),
        manipulateBankAccountAmount(
          DECREASE,
          { id: rawBankAccount.id, amount: rawBankAccount.amount },
          { ...options, transaction }
        )
      ])
      .then(() => ({
        senderBankAccountId: rawBankAccount.id,
        receiverBankAccountId: cashboxBankAccount.id,
        amount: rawBankAccount.amount
      }))
    })
  });
};

/**
 * Withdraw all money from cashbox.
 *
 * @param options
 * @returns {*}
 */
const withdrawMoneyFromCashbox = (options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.BankAccount.fetchOne({ accountType: ACCOUNT_TYPE.CASHBOX }, { ...options, transaction })
      .then(cashboxAccount => manipulateBankAccountAmount(
        DECREASE,
        { id: cashboxAccount.id, amount: cashboxAccount.amount },
        { ...options, transaction }
      ));
  });
};



module.exports = {
  transferAllToCashboxFromRaw,
  withdrawMoneyFromCashbox
};