'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Assets', 'url', {
      type: Sequelize.STRING
    })
  },
  down: function(queryInterface, Sequelize) {
  }
};
