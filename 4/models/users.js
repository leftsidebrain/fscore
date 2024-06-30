"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.collections, {
        foreignKey: "user_id",
      });
      // define association here
    }
    toJSON() {
      return { ...this.get(), id: undefined, password: undefined, createdAt: undefined, updatedAt: undefined };
    }
  }
  users.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,

      modelName: "users",
    }
  );
  return users;
};
