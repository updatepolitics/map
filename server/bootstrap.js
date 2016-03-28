var csv = Npm.require('csv');
var fs = Npm.require('fs');

Meteor.startup(function(){

  function importHubs() {
    var hubs;

    Hubs.remove({});

    Async.runSync(function(doneImportHubs){
      rs = fs.createReadStream(process.env.PWD +'/data/hubs.csv');
      var parser = csv.parse({columns: true}, function(err, data){
        if (err) return doneImportHubs(err);
        hubs = data;
        doneImportHubs();
      });
      rs.pipe(parser);
    });


    _.each(hubs, function(hub){
      Hubs.insert(hub);
    });
  }

  function importCountries() {
    var countries;

    Countries.remove({});

    Async.runSync(function(doneImportCountries){
      rs = fs.createReadStream(process.env.PWD +'/data_local/countries.csv');
      var parser = csv.parse({columns: true}, function(err, data){
        if (err) return doneImportCountries(err);
        countries = data;
        doneImportCountries();
      });
      rs.pipe(parser);
    });

    _.each(countries, function(country){
      Countries.insert(country);
    });
  }

  function importNatures() {
    var natures;

    Natures.remove({});

    Async.runSync(function(doneImportNatures){
      rs = fs.createReadStream(process.env.PWD +'/data/hub-natures.csv');
      var parser = csv.parse({columns: true}, function(err, data){
        if (err) return doneImportNatures(err);
        natures = data;
        doneImportNatures();
      });
      rs.pipe(parser);
    });

    _.each(natures, function(nature){
      Natures.insert(nature);
    });
  }

  if (Countries.find({}).count() == 0) importCountries();
  if (Natures.find({}).count() == 0) importNatures();
  if (Hubs.find({}).count() == 0) importHubs();

});
