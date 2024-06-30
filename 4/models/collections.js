"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class collections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      collections.hasMany(models.tasks, { foreignKey: "collections_id", onDelete: "CASCADE", hooks: true });
      collections.belongsTo(models.users, { foreignKey: "user_id" });
    }

    toJSON() {
      return { ...this.get(), id: undefined, createdAt: undefined, updatedAt: undefined };
    }
  }
  collections.init(
    {
      name: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "collections",
    }
  );
  return collections;
};
