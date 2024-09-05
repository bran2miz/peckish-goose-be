'use strict';

const menusModel = (sequelize, DataTypes) => sequelize.define('Menus', {
  itemName: { type: DataTypes.STRING, allowNull: false },
  itemDescription: { type: DataTypes.STRING, allowNull: false },
  itemRating: { type: DataTypes.INTEGER, allowNull: false },
  itemReview: { type: DataTypes.STRING, allowNull: false },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = menusModel;
