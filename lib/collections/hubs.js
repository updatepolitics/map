/*
* Hub
*/

Hubs = new Mongo.Collection("hubs");
HubSchema = new SimpleSchema({
  city: {
    type: String,
    label: "City",
    max: 100,
    optional: true
  },
  description_en: {
    type: String,
    label: "Description (en)",
    optional: true,
    max: 2000
  },
  description_pt: {
    type: String,
    label: "Description (pt)",
    optional: true,
    max: 2000
  },
  description_es: {
    type: String,
    label: "Description (es)",
    optional: true,
    max: 2000
  },
  incidencyReach: {
    type: String
  },
  isSponsor: {
    type: Boolean,
    defaultValue: false
  },
  name: {
      type: String,
      label: "Name",
      max: 200
  },
  nature: {
    type: String,
  },
  parentHubs: {
    optional: true,
    type: [String],
    label: "Parent Hubs",
    autoform: {
      afFieldInput: {
        type: 'select',
        search: true,
        multiple: true
      }
    }
  },
  placesOfOrigin: {
    type: [String],
    optional: true,
    autoform: {
      afFieldInput: {
        label: "Places of origin",
        type: 'select',
        search: true,
        multiple: true
      }
    }
  },
  relatedHubs: {
    optional: true,
    type: [String],
    label: "Related Hubs",
    autoform: {
      afFieldInput: {
        label: "Related hubs",
        type: 'select',
        search: true,
        multiple: true
      }
    }
  },
  website: {
    type: String,
    // regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  labels: {
    type: Object,
    blackbox: true,
    autoValue: function() {
      var languages = ['en', 'es', 'pt'];
      var result = {};
      var initiative = Hubs.findOne(this.docId);

      // bootstrap result
      _.each(languages, function(lang){ result[lang] = {}; });

      /*
       * Denormalize "incidencyReach"
       */
      var incidencyReach = IncidencyReachs.findOne(initiative.incidencyReach);
      if (incidencyReach) {
        // join labels in a single string
        _.each(languages, function(lang){
          result[lang].incidencyReach = incidencyReach[lang];
        });
      }

      /*
       * Denormalize "nature"
       */
      var nature = Natures.findOne(initiative.nature);
      if (nature) {
        // join labels in a single string
        _.each(languages, function(lang){
          result[lang].nature = nature[lang];
        });
      }

      /*
       * Denormalize "relatedHubs"
       */
      var relatedHubs = initiative.relatedHubs;
      if (relatedHubs && relatedHubs.length > 0) {

        // bootstrap origin labels
        _.each(languages, function(lang){ result[lang].relatedHubs = []; });

        // for each origin
        _.each(relatedHubs, function(relatedHubId){
          // retrieve origin
          var relatedHub = Hubs.findOne(relatedHubId);

          // get relatedHubs name for each language
          _.each(languages, function(lang){
            result[lang].relatedHubs.push(relatedHub.name);
          });
        });

        // join labels in a single string
        _.each(languages, function(lang){
          result[lang].relatedHubs = result[lang].relatedHubs.join(', ');
        });
      }

      /*
       * Denormalize "parentHubs"
       */
      var parentHubs = initiative.parentHubs;
      if (parentHubs && parentHubs.length > 0) {

        // bootstrap origin labels
        _.each(languages, function(lang){ result[lang].parentHubs = []; });

        // for each origin
        _.each(parentHubs, function(parentHubId){
          // retrieve origin
          var parentHub = Hubs.findOne(parentHubId);

          // get parentHubs name for each language
          _.each(languages, function(lang){
            result[lang].parentHubs.push(parentHub.name);
          });
        });

        // join labels in a single string
        _.each(languages, function(lang){
          result[lang].parentHubs = result[lang].parentHubs.join(', ');
        });
      }

      /*
       * Denormalize "placesOfOrigin"
       */
      var placesOfOrigin = initiative.placesOfOrigin;
      if (placesOfOrigin && placesOfOrigin.length > 0) {

        // bootstrap origin labels
        _.each(languages, function(lang){ result[lang].placesOfOrigin = []; });

        // for each origin
        _.each(placesOfOrigin, function(originId){

          // retrieve origin
          var origin = Origins.findOne(originId);

          // get origin name for each language
          _.each(languages, function(lang){
            result[lang].placesOfOrigin.push(origin[lang]);
          });
        });

        // join labels in a single string
        _.each(languages, function(lang){
          result[lang].placesOfOrigin = result[lang].placesOfOrigin.join(', ');
        });
      }


      return result;
    }
  }
});
Hubs.attachSchema(HubSchema);
