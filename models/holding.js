
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Holding = sequelize.define("Holding", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Holding.hasMany(models.User, { foreignKey: 'holding_id', as: 'holding'});
        //Holding.hasMany(models.User, { foreignKey: 'holding_id', allowNull : false, foreignKeyConstraint:true});
      },
      addHolding : function(holdingName, callback){
          Holding.create({
              name: holdingName
          }).then(function(holding) {
              callback({success: true});
          }).catch(function(error){
              callback({success : false, message : error});
          });
      },

      updateHolding : function(holdingId, holdingName, callback){
          Holding.update({
            name: holdingName
          },{
            where : {
              id: holdingId
            }
          }).then(function(holding) {
            callback({success: true});
          }).catch(function(error){
            callback({success : false, message : error});
          });
      },

      getHoldingById : function(holdingId, callback){
          Holding.findOne({
            where: {
              id: holdingId
            }
        }).then(function(holding) {
            if(holding){
              callback({status : true, data : holding});
            } else {
              callback({status : false, message : 'Holding not found'});
            }
          }).catch(function(error){
            callback({success : false, message : error});
          });
      },

      deleteHolding : function(holdingId, callback){
        Holding.destroy({
            where: {
              id: holdingId
            }
        }).then(function() {
            callback({status : true});
        }).catch(function(error){
            callback({success : false, message : error});
        }); 
      },

      getAllHolding : function(callback){
        Holding.findAll().then(function(holdingList) {
            callback({success: true, data: holdingList});
        }).catch(function(error){
            callback({success : false, message : error});
        });
      }
    }
  });
  return Holding;
};