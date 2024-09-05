'use strict';

const express = require('express');
const dataModules = require('../models/index.js');
const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');

const v2Router = express.Router();

//Assign correct model to the request model based on the URL parameter :model.
v2Router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName].model || dataModules[modelName];  // Access the raw Sequelize model
    // ie : If the model parameter is restaurants, req.model is set to restaurantsModel
    next();
  } else {
    next('Invalid Model');
  }
});

// CRUD operations but must pass through token authetnication and ACL.
v2Router.get('/:model', bearerAuth, permissions('read'),handleGetAll);
v2Router.get('/:model/:id', bearerAuth, permissions('read'), handleGetOne);
v2Router.post('/:model', bearerAuth, permissions('create'), handleCreate);
v2Router.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
v2Router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  try {
    const options = buildIncludeOptions(req.model.name);
    let allRecords = await req.model.get(null, options);
    res.status(200).json(allRecords);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching records', error: err });
  }
}

// find by the id 
async function handleGetOne(req, res) {
  // req.params: { model: 'restaurants', id: '1' }
  const id = req.params.id;
  try {
    // find by primary key
    const restaurant = await req.model.findByPk(id, {
      include: [{ model: dataModules['menusModel'] }]
    });
    
    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching record', error: err.message });
  }
}


function buildIncludeOptions(modelName) {
  if (modelName === 'restaurantsModel') {
    return { include: { model: dataModules['menusModel'] } };
  }
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

module.exports = v2Router;