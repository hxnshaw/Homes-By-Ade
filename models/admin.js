"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init(
    {
      email: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { message: "Please enter a valid email address" },
        },
      },
      password: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        validate: {
          min: 4,
        },
      },
      role: {
        type: DataTypes.STRING,
        required: true,
        defaultValue: "admin",
      },
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  Admin.addHook("beforeSave", async function (admin) {
    if (!admin.changed("password")) return;
    const salt = await bcrypt.genSaltSync(10);
    admin.password = await bcrypt.hashSync(admin.password, salt);
  });

  Admin.prototype.comparePassword = async function (adminPassword) {
    const admin = this;
    const isMatch = await bcrypt.compare(adminPassword, admin.password);
    if (!isMatch) throw new Error("Invalid Credentials");
    return isMatch;
  };

  return Admin;
};
