
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Holding = sequelize.define("Holding", {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Holding.hasMany(models.User, { foreignKey: 'holding_id', as: 'holding'});
      },
      addHolding : function(holdingName, callback){
          Holding.create({
              name: holdingName
          }).then(function(holding) {
              callback({success: true});
          }).catch(function(error){
              callback({success : false, message : 'Unable to add the holding.', error: error});
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
            callback({success : false, message : 'Unable to update the holding.', error: error});
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
            callback({success : false, message : 'Holding not found.', error: error});
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
            callback({success : false, message : 'Unable to delete the holding.', error: error});
        }); 
      },

      getAllHolding : function(callback){
        Holding.findAll().then(function(holdingList) {
            callback({success: true, data: holdingList});
        }).catch(function(error){
            callback({success : false, message : 'Unable to fetch the holding list.', error: error});
        });
      }
    }
  });
  return Holding;
};