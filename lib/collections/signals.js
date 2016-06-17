/*
* Signal
*/

Signals = new Mongo.Collection("signals");
const SignalSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    website: {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true
    },
    city: {
      type: String,
      label: "City",
      max: 100,
      optional: true
    },
    origin: {
      type: String,
      optional: true
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
    incidencyReach: {
      type: String
    },
    incidencyTypes: {
      optional: true,
      type: [String],
      label: "Incidency types",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
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
    technologyType: {
      type: String,
      label: "Type",
      optional: false
    },
    purpose: {
      type: String,
      label: "Purpose",
      optional: false
    },
    methods: {
      optional: true,
      type: [String],
      label: "Methods",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    mainThemes: {
      optional: true,
      type: [String],
      label: "Main themes",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    secondaryThemes: {
      optional: true,
      type: [String],
      label: "Secondary themes",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    isOpenLicense: {
      type: Boolean,
      optional: true
    },
    notes: {
      type: String,
      label: "Notes",
      optional: true,
      max: 2000
    },
    description_pt: {
        type: String,
        label: "Description (pt)",
        optional: true,
        max: 2000
    },
    description_en: {
        type: String,
        label: "Description (en)",
        optional: true,
        max: 2000
    },
    description_es: {
        type: String,
        label: "Description (es)",
        optional: true,
        max: 2000
    },
    labels: {
      type: Object,
      blackbox: true,
      autoValue: function() {
        var languages = ['en', 'es', 'pt'];
        var result = {};
        var initiative = Signals.findOne(this.docId);

        // bootstrap result
        _.each(languages, function(lang){ result[lang] = {}; });

        /*
         * Denormalize "incidencyTypes"
         */
        var incidencyTypes = initiative.incidencyTypes;
        if (incidencyTypes && incidencyTypes.length > 0) {

          // bootstrap origin labels
          _.each(languages, function(lang){ result[lang].incidencyTypes = []; });

          // for each origin
          _.each(incidencyTypes, function(incidencyTypeId){

            // retrieve origin
            var incidencyType = IncidencyTypes.findOne(incidencyTypeId);

            // get incidencyType name for each language
            _.each(languages, function(lang){
              result[lang].incidencyTypes.push(incidencyType[lang]);
            });
          });

          // join labels in a single string
          _.each(languages, function(lang){
            result[lang].incidencyTypes = result[lang].incidencyTypes.join(', ');
          });
        }

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
         * Denormalize "mainThemes"
         */
        var mainThemes = initiative.mainThemes;
        if (mainThemes && mainThemes.length > 0) {

          // bootstrap origin labels
          _.each(languages, function(lang){ result[lang].mainThemes = []; });

          // for each origin
          _.each(mainThemes, function(mainThemeId){

            // retrieve mainTheme
            var mainTheme = Themes.findOne(mainThemeId);

            // get mainTheme name for each language
            _.each(languages, function(lang){
              result[lang].mainThemes.push(mainTheme[lang]);
            });
          });

          // join labels in a single string
          _.each(languages, function(lang){
            result[lang].mainThemes = result[lang].mainThemes.join(', ');
          });
        }

        /*
         * Denormalize "methods"
         */
        var methods = initiative.methods;
        if (methods && methods.length > 0) {

          // bootstrap origin labels
          _.each(languages, function(lang){ result[lang].methods = []; });

          // for each origin
          _.each(methods, function(methodId){

            // retrieve method
            var method = Methods.findOne(methodId);

            // get method name for each language
            _.each(languages, function(lang){
              result[lang].methods.push(method[lang]);
            });
          });

          // join labels in a single string
          _.each(languages, function(lang){
            result[lang].methods = result[lang].methods.join(', ');
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

        /*
         * Denormalize "purpose"
         */
        var purpose = Purposes.findOne(initiative.purpose);
        if (purpose) {
          // join labels in a single string
          _.each(languages, function(lang){
            result[lang].purpose = purpose[lang];
          });
        }

        /*
         * Denormalize "technologyType"
         */
        var technologyType = TechnologyTypes.findOne(initiative.technologyType);
        if (technologyType) {
          // join labels in a single string
          _.each(languages, function(lang){
            result[lang].technologyType = technologyType[lang];
          });
        }

        return result;
      }
    }
});
Signals.attachSchema(SignalSchema);
