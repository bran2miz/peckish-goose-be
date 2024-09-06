'use strict';

const restaurantsModel = (sequelize, DataTypes) => sequelize.define('Restaurants', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    displayName: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING, allowNull: false }
});

module.exports = restaurantsModel;
