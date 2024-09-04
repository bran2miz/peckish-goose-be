'use strict';

const menusModel = (sequelize, DataTypes) => sequelize.define('Menus', {
  itemName: { type: DataTypes.STRING, required: true },
  itemDescription: { type: DataTypes.STRING, required: true },
  itemRating: { type: DataTypes.INTEGER, required: true },
  itemReview: { type: DataTypes.STRING, required: true },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = menusModel;
