'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CalendarConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CalendarConfig.init(
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      token: {
        type: DataTypes.STRING(10000),
        allowNull: false,
        unique: true,
      },
      calendarId: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Primary',
      },
    },
    {
      sequelize,
      tableName: 'calendar_configs',
      modelName: 'CalendarConfig',
    }
  );
  return CalendarConfig;
};
