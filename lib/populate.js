/*
 * Module dependencies
 */
var app = require('../server/server');
var fs = require('fs');
var async = require('async');
var csv = require('csv');

var hubIds = {}

var data;

exports.loadCsv = function(doneLoadCsv) {
  rs = fs.createReadStream(__dirname+'/../data/data.csv');
  var parser = csv.parse({columns: true, trim: true}, function(err, csv){
    if (err) return doneLoadCsv(err);
    data = csv;
    doneLoadCsv();
  });
  rs.pipe(parser);
}

exports.importHubs = function(doneImportHubs){
  var Hub = app.models.Hub;

  Hub.deleteAll(function(err, count){
    if (err) throw err;

  //   if (count == 0) {
        async.eachSeries(data, function(record, doneEach){
          if (record["Definição"] == "Hub / Ator") {
            importHub(record, doneEach);
          } else doneEach();
        }, function(err){
          if (!err) console.log('Data imported successfully');
          doneImportHubs(err);
        });
  //   } else doneImportHubs();
  });

  function importHub(record, doneParseHub) {

    record['name'] = record['Nome'];
    record['description'] = record['Descrição'];
    record['website'] = record['Site'];

    switch (record['Abrangência da incidência']) {
      case 'Local':
        record['incidenceReach'] = 'local';
        break;
      case 'Regional':
        record['incidenceReach'] = 'regional';
        break;
      case 'Nacional':
        record['incidenceReach'] = 'national';
        break;
      case 'Internacional':
        record['incidenceReach'] = 'international';
        break;
      default:
    }

    var hub = new Hub(record);
    hub.save(function(err){
      if (err) return doneParseHub(err);
      hubIds[record['name']] = hub.id;
      doneParseHub();
    });

  }


}

exports.setHubsParents = function(doneSetHubsParents){
  var Hub = app.models.Hub;
  var Affiliation = app.models.Affiliation;

  async.eachSeries(data, function(record, doneRecord){

    var childName = record['Nome'];
    var parentNames = record['parentHubs'];
      // console.log(record);

    console.log(parentNames);
    if (!parentNames) return doneRecord();
    else {
      parentNames = parentNames.split(',');
      var childId = hubIds[childName];

      if (!childId) return doneSetHubsParents(new Error('missing childId'));

      // console.log(childName);
      // console.log(childId);

      async.eachSeries(parentNames, function(parentName, doneEachParent){
        var parentId = hubIds[parentName];

        // console.log(parentName);
        console.log(parentName);
        console.log(parentId);

        if (!parentId) return doneSetHubsParents(new Error('missing parentId'));

        var affiliation = new Affiliation();
        affiliation.childId = childId;
        affiliation.parentId = parentId;


        // console.log(affiliation.toJSON());
        affiliation.save(doneEachParent);
      }, doneRecord);

      //
      // console.log(parentName);
      //
      // console.log('childId '+childId);
      // console.log('parentId '+parentId);
      //
      // Hub.updateAll({
      //   id: hubIds[record['Nome']]
      //   },{
      //     parent: hubIds[record['Qual/Quais? (usar ; )']]
      //   }, doneRecord)
    }
  }, doneSetHubsParents);




}
