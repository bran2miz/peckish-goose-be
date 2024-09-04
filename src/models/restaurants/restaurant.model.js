'use strict';

const restaurantsModel = (sequelize, DataTypes) => sequelize.define('Restaurants', {
  name: { type: DataTypes.STRING, required: true },
  description: { type: DataTypes.STRING, required: true },
  displayName: { type: DataTypes.STRING, required: true }
});

module.exports = restaurantsModel;
