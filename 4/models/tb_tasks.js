'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tb_tasks.init({
    to_do: DataTypes.STRING,
    is_done: DataTypes.STRING,
    collections_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_tasks',
  });
  return tb_tasks;
};