'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.hasMany(models.Meeting, {
        as: 'meetings',
        foreignKey: 'roomId',
      });
    }
  }
  Room.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'rooms',
      modelName: 'Room',
      hooks: {
        /**
         *  Before CRUD operations hooks
         */
        beforeValidate(rooms, options) {
          console.log('Room Before validate', rooms, options);
        },
        beforeCreate(rooms, options) {
          console.log('Room Before Create', rooms, options);
        },

        beforeDestroy(rooms, options) {
          console.log('Room Before Destroy', rooms, options);
        },

        /**
         *  After CRUD operations hooks
         */
        afterValidate(rooms, options) {
          console.log('Room After Validate', rooms, options);
        },
        afterCreate(rooms, options) {
          console.log('Room After Create', rooms, options);
        },
        afterUpdate(rooms, options) {
          console.log('Room After Update', rooms, options);
        },
        afterDestroy(rooms, options) {
          console.log('Room After Destroy', rooms, options);
        },
      },
    }
  );
  return Room;
};
