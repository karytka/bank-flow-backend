const { DataTypes } = require('sequelize');
const { TABLE_NAME } = require('../constants');

const DEFINITION_OBJECT = {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  amount: { type: DataTypes.DOUBLE, allowNull: false },
  contractNumber: { type: DataTypes.INTEGER, allowNull: false },
  depositProgramCreatedAt: { type: DataTypes.DATEONLY, allowNull: false },
  depositProgramEndsAt: { type: DataTypes.DATEONLY, allowNull: false },
};

const CONFIGURATION_OBJECT = {
  tableName: TABLE_NAME,
  indexes: [
    {
      unique: true,
      fields: ['contractNumber']
    }
  ]
};


module.exports = {
  DEFINITION_OBJECT,
  CONFIGURATION_OBJECT
};