'use strict';
module.exports = function(sequelize, DataTypes) {
  var extend = require("extend");

  var Announcement = sequelize.define('Announcement', {
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Announcement.belongsTo(models.Asset, { as: "asset" });
        Announcement.belongsTo(models.User, { as: "creator" });
      },
      findByDate: function(date, options) {
        return Announcement.findAll(extend({
          where: {
            startDate: {
              "$lte": date
            },
            endDate: {
              "$gt": date
            }
          }
        }, options));
      }
    }
  });

  return Announcement;
};
