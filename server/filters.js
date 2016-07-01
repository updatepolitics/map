Meteor.methods({
  initFilters:function(){

    /*
     * INIT FILTERS
     */

    var filters = {
      general: {
        placesOfOrigin: {},
        incidencyReach: {},
      },
      signals: {
        mainThemes: {},
        mechanisms: {},
        purpose: {},
        technologyType: {},
      },
      hubs: {
        nature: {},
        isSponsor: {
          'true': {
            _id: true,
            pt: 'Sim',
            es: 'Sí',
            en: 'Yes',
            selected: false
          },
          'false': {
            _id: false,
            pt: 'Não',
            es: 'No',
            en: 'No',
            selected: false
          }
        }
      }
    }

    var placesOfOrigin = [];

    var signals = [];
    Signals.find({}, {
      fields: {
        placesOfOrigin: 1
      }
    }).forEach(function(signal){
      placesOfOrigin = placesOfOrigin.concat(signal.placesOfOrigin);
    });

    var hubs = [];
    Hubs.find({}, {
      fields: {
        placesOfOrigin: 1
      }
    }).forEach(function(hub){
      placesOfOrigin = placesOfOrigin.concat(hub.placesOfOrigin);
    });

    Origins
      .find({_id: {$in: _.uniq(placesOfOrigin)}})
      .forEach(function(i){
        i.selected = false;
        filters.general.placesOfOrigin[i._id] = i;
      });

    var placesOfOriginOptions = [];
    Origins
      .find({_id: {$in: _.uniq(placesOfOrigin)}})
      .forEach(function(i){
        i.selected = false;
        filters.general.placesOfOrigin[i._id] = i;
      });

    IncidencyReachs
      .find({})
      .forEach(function(i){
        i.selected = false;
        filters.general.incidencyReach[i._id] = i;
      });

    TechnologyTypes
      .find({})
      .forEach(function(i){
        i.selected = false;
        filters.signals.technologyType[i._id] = i;
      });

    Themes
      .find({})
      .forEach(function(i){
        i.selected = false;
        filters.signals.mainThemes[i._id] = i;
      });

    Mechanisms
      .find({})
      .forEach(function(i){
        i.selected = false;
        filters.signals.mechanisms[i._id] = i;
      });

    Purposes
      .find({})
      .forEach(function(i){
        i.selected = false;
        filters.signals.purpose[i._id] = i;
      });

    Natures
      .find({})
      .forEach(function(i){
        i.selected = false;
        filters.hubs.nature[i._id] = i;
      });

    return filters;
  }
});
