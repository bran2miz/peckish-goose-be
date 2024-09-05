'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const Collection = require('./data-collections.js');
const userModel = require('../auth/models/users.model.js');
const restaurantsSchema = require('./restaurants/restaurant.model.js');
const menusSchema = require('./menu/menu.model.js');

const POSTGRES_URI =
  process.env.NODE_ENV === 'test' ? 'sqlite:memory' : process.env.DATABASE_URL;

const sequelize = new Sequelize(POSTGRES_URI);
const menusModel= menusSchema(sequelize, DataTypes);
const restaurantsModel = restaurantsSchema(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

restaurantsModel.hasMany(menusModel, {foreignKey: 'restaurantId', sourceKey:'id'});
menusModel.belongsTo(restaurantsModel, {foreignKey: 'restaurantId', targetKey: 'id'})

const restaurantsCollection = new Collection(restaurantsModel);
const menusCollection = new Collection(menusModel);

module.exports = {
  db: sequelize,
  users,
  restaurants: restaurantsCollection,
  menus: menusCollection,
  restaurantsModel, // Export the raw Sequelize models
  menusModel
};
