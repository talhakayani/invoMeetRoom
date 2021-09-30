'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meeting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      Meeting.belongsTo(models.Room, {
        as: 'room',
        foreignKey: 'roomId',
      });
    }
  }
  Meeting.init(
    {
      reservedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reservedWith: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reservedFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          async reserveMeetingDate() {
            const enteredReservedFromDate = new Date(this.reservedFrom);
            const enteredReservedToDate = new Date(this.reservedTo);
            const enteredRoomId = this.roomId;
            const user = this.reservedBy;
            const meeting = await Meeting.findAll({
              where: {
                //reservedFrom: this.reservedFrom,
                // roomId: this.roomId,
                //reservedBy: this.reservedBy,
                inProgress: 'InProgress',
              },
            });
            for (let i = 0; i < meeting.length; i++) {
              if (
                meeting[i].roomId == enteredRoomId &&
                enteredReservedToDate > meeting[i].reservedFrom &&
                enteredReservedToDate <= meeting[i].reservedTo
              ) {
                if (meeting[i].reservedBy == user) {
                  throw new Error(
                    "You can't reserve this room because this room is already reserved by you. May be you want another meeting in this room so for that you have to specify the time which have no conflict with other meetings or you can choose other rooms available"
                  );
                }

                throw new Error(
                  'Your meeting time have conflict with other meeting time, we suggest you to please change the meeting time'
                );
              }
              if (
                // enteredReservedFromDate >= meeting[i].reservedFrom &&
                // enteredReservedFromDate <= meeting[i].reservedTo
                enteredReservedToDate > meeting[i].reservedFrom &&
                enteredReservedToDate <= meeting[i].reservedTo
              ) {
                if (meeting.reservedBy == user) {
                  throw new Error(
                    'You can not reserve the meeting when you already have meeting reserved at the same time in other room'
                  );
                }
                throw new Error(
                  'You can not reserve the meeting in this room at this time, because there is another meeting reserved at this time'
                );
              }
            }
          },
        },
      },
      reservedTo: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      inProgress: {
        type: DataTypes.STRING,
        defaultValue: 'InProgress',
      },
      googleCalendarEventId: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'meetings',
      modelName: 'Meeting',
      hooks: {
        /**
         *  Before CRUD operations hooks
         */
        beforeValidate: (meetings, options) => {
          let check = true;
          meetings.reservedFrom = new Date(meetings.reservedFrom);
          Meeting.reservedFrom = meetings.reservedFrom;
          if (meetings.reservedTo == null) {
            check = false;
            const date = new Date(meetings.reservedFrom);
            const newTime = date.setHours(date.getHours() + 1);
            meetings.reservedTo = new Date(newTime);
            Meeting.reservedTo = meetings.reservedTo;
            console.log(meetings.reservedTo == Meeting.reservedTo);
          }
          if (check) {
            console.log('this condition is running as well');
            meetings.reservedTo = new Date(meetings.reservedTo);
            Meeting.reservedTo = meetings.reservedTo;
          }
        },

        beforeCreate(meetings, options) {
          console.log('Meeting Before Create', meetings, options);
        },

        beforeDestroy(meetings, options) {
          console.log('Meeting Before Destroy', meetings, options);
        },

        /**
         *  After CRUD operations hooks
         */
        afterValidate(meetings, options) {
          console.log('Meeting After Validate', meetings, options);
        },
        afterCreate(meetings, options) {
          console.log('Meeting After Create', meetings, options);
        },
        afterUpdate(meetings, options) {
          console.log('Meeting After Update', meetings, options);
        },
        afterDestroy(meetings, options) {
          console.log('Meeting After Destroy', meetings, options);
        },
      },
    }
  );
  return Meeting;
};
