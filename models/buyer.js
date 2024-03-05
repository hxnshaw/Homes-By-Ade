"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Buyer.init(
    {
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: { message: "Please Provide A Valid Email Address" },
        },
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
      modelName: "Buyer",
    }
  );

  //hash buyer password
  Buyer.addHook("beforeSave", async function (buyer) {
    if (!buyer.changed("password")) return;
    const salt = await bcrypt.genSaltSync(10);
    clerk.password = await bcrypt.hashSync(buyer.password, salt);
  });

  //method to check user entered the correct password
  Buyer.prototype.comparePassword = async function (buyerPassword) {
    const buyer = this;
    const isMatch = await bcrypt.compare(buyerPassword, buyer.password);
    if (!isMatch) throw new Error("Invalid Credentials");
    return isMatch;
  };
  return Buyer;
};
