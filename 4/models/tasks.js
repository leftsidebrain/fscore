"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      tasks.belongsTo(models.collections, { foreignKey: "collections_id" });
    }
    toJSON() {
      return { ...this.get(), id: undefined, createdAt: undefined, updatedAt: undefined };
    }
  }
  tasks.init(
    {
      to_do: DataTypes.STRING,
      is_done: DataTypes.BOOLEAN,
      collections_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "tasks",
    }
  );
  return tasks;
};
