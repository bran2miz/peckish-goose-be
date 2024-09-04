'use strict';

const express = require('express');
const dataModules = require('../models');
const acl = require('../auth/middleware/acl.js');
const bearer = require('../auth/middleware/bearer.js');

const router = express.Router();

function checkAuthorization(capability) {
  return [bearer, acl(capability)];
}

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

// access to bearer to get through the first checkpoint
router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', checkAuthorization('create'), handleCreate);
router.put('/:model/:id', checkAuthorization('update'), handleUpdate);
router.delete('/:model/:id', checkAuthorization('delete'), handleDelete);

async function handleGetAll(req, res) {
  const options = buildIncludeOptions(req.model.name);
  let allRecords = await req.model.get(null, options);
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  const options = buildIncludeOptions(req.model.name);
  let theRecord = await req.model.get(id, options);
  res.status(200).json(theRecord);
}

function buildIncludeOptions(modelName) {
  if (modelName === 'Restaurants') {
    return { include: { model: dataModules['Menus'] } };
  }
  return {};
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

module.exports = router;