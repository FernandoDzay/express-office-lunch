'use strict';
const {Model} = require('sequelize');
const fs = require('fs');

module.exports = (sequelize, DataTypes) => {
  class Food extends Model {

    static associate(models) {

    }
  }
  Food.init(
  {
    full_name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    image: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Food',
    tableName: 'foods',
    hooks: {
      beforeDestroy: deleteImage,
      afterSave: function(instances, options) {
        const isNewRecord = instances._options.isNewRecord;
        const imageChanged = instances._previousDataValues.image !== instances.dataValues.image;
        if(!isNewRecord && imageChanged) deleteImage(instances, options);
      },
    }
  });
  return Food;
};


// ---------------------- Functions

const deleteImage = (instances, options) => {
  const image = instances._previousDataValues.image;
  if(image !== 'default.jpg') {
    try { fs.unlinkSync(`public/img/foods/${image}`); }
    catch(error) { console.log(error); }
  }
}