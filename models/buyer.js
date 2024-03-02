'use strict';
const {
  Model
} = require('sequelize');
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
  Buyer.init({
    email: {
      type:DataTypes.STRING,
      required:true,
      unique:true,
      allowNull:false,
      validate:{
        isEmail:{message:'Please Provide A Valid Email Address'}
      }
    },
    password: {
      type:DataTypes.STRING,
      required:true,
      allowNull:false,
      validate:{
        min:5
      }
    },
    role: {
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:"buyer"
    }
  }, {
    sequelize,
    modelName: 'Buyer',
  });
  return Buyer;
};