'use strict';

// THIS IS THE STRETCH GOAL ...
// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema. That's not very DRY!

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(id = null, options = {}) {
    if (id) {
      return this.model.findByPk(id, options);
    } else {
      return this.model.findAll(options);
    }
  }

  create(record) {
    return this.model.create(record);
  }

  update(id, obj) {
    return this.model.update(obj, { where: { id }, returning: true });
  }

  delete(id) {
    return this.model.destroy({ where: { id } });
  }

}

module.exports = DataCollection;
