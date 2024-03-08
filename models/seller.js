"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
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
        defaultValue: "seller",
      },
    },
    {
      sequelize,
      modelName: "Seller",
    }
  );

  Seller.addHook("beforeSave", async function (seller) {
    if (!seller.changed("password")) return;
    const salt = await bcrypt.genSaltSync(10);
    seller.password = await bcrypt.hashSync(seller.password, salt);
  });

  Seller.prototype.comparePassword = async function (sellerPassword) {
    const seller = this;
    const isMatch = await bcrypt.compare(sellerPassword, seller.password);
    if (!isMatch) throw new Error("Invalid Credentials");
    return isMatch;
  };

  return Seller;
};
