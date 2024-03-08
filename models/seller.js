"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Seller.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: { message: "Please provide a valid email address" },
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      professional_type: {
        type: DataTypes.ENUM("Landlord", "Real Estate Agent"),
      },
      password: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        validate: {
          min: 5,
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "buyer",
      },
    },
    {
      sequelize,
      modelName: "Seller",
    }
  );
  return Seller;
};
