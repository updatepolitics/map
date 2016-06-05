
// get sync function for csv-stringify
var csvStringify = require('csv-stringify');
var csvStringifySync = Meteor.wrapAsync(csvStringify);

// helper funtion to generate csv from collection
var generateCsv = function(properties, items) {

  // add file header
  var results = [ properties ]

  // add lines
  _.each(items, function(i){
    var line = [];
    _.each(properties, function(property){
      line.push(i[property]);
    });
    results.push(line);
  });

  return csvStringifySync(results);
}

var getCollectionCsv = function(collection) {
  switch (collection) {
    case 'hubs':
      // select properties
      var properties = [
        "_id",
        "name",
        "description_en",
        "description_pt",
        "description_es",
        "website",
        "city",
        "origin",
        "placesOfOrigin",
        "incidencyReach",
        "nature",
        "isSponsor",
        "relatedHubs",
        "parentHubs"
      ];

      // get hubs
      var items = Hubs.find().fetch();
      break;
    case 'signals':
      // select properties
      var properties = [
        "_id",
        "name",
        "description_pt",
        "description_en",
        "description_es",
        "website",
        "city",
        "origin",
        "placesOfOrigin",
        "incidencyReach",
        "incidencyTypes",
        "parentHubs",
        "technologyType",
        "purpose",
        "methods",
        "mainThemes",
        "secondaryThemes",
        "isOpenLicense"
      ];
      // get hubs
      var items = Signals.find().fetch();
      break;
    case 'incidencyReachs':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt",
        "level"
      ];
      // get hubs
      var items = IncidencyReachs.find().fetch();
      break;
    case 'origins':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt",
        "type"
      ];
      // get hubs
      var items = Origins.find().fetch();
      break;
    case 'incidencyTypes':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt"
      ];
      // get hubs
      var items = IncidencyTypes.find().fetch();
      break;
    case 'technologyTypes':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt"
      ];
      // get hubs
      var items = TechnologyTypes.find().fetch();
      break;
    case 'purposes':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt"
      ];
      // get hubs
      var items = Purposes.find().fetch();
      break;
    case 'themes':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt",
        "description_pt",
        "description_en",
        "description_es",
        "color"
      ];
      // get hubs
      var items = Themes.find().fetch();
      break;
    case 'natures':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt",
        "description_pt",
        "description_en",
        "description_es",
        "color"
      ];
      // get hubs
      var items = Natures.find().fetch();
      break;
    case 'mechanisms':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt",
        "description_pt",
        "description_en",
        "description_es"
      ];
      // get hubs
      var items = Mechanisms.find().fetch();
      break;
    case 'methods':
      // select properties
      var properties = [
        "_id",
        "en",
        "es",
        "pt",
        "description_pt",
        "description_en",
        "description_es",
        "mechanism"
      ];
      // get hubs
      var items = Methods.find().fetch();
      break;
  }

  return generateCsv(properties, items);
}

Meteor.methods({
  'updateDataZip': function() {
    return [{
      filename: 'hubs.csv',
      content: getCollectionCsv('hubs')
    },{
      filename: 'signals.csv',
      content: getCollectionCsv('signals')
    },{
      filename: 'incidencyReachs.csv',
      content: getCollectionCsv('incidencyReachs')
    },{
      filename: 'incidencyTypes.csv',
      content: getCollectionCsv('incidencyTypes')
    },{
      filename: 'mechanisms.csv',
      content: getCollectionCsv('mechanisms')
    },{
      filename: 'methods.csv',
      content: getCollectionCsv('methods')
    },{
      filename: 'natures.csv',
      content: getCollectionCsv('natures')
    },{
      filename: 'origins.csv',
      content: getCollectionCsv('origins')
    },{
      filename: 'purposes.csv',
      content: getCollectionCsv('purposes')
    },{
      filename: 'technologyTypes.csv',
      content: getCollectionCsv('technologyTypes')
    },{
      filename: 'themes.csv',
      content: getCollectionCsv('themes')
    }]
  },
  'hubsCsv': function() {
    return getCollectionCsv('hubs');
  },
  'signalsCsv': function() {
    return getCollectionCsv('signals');
  }
});
