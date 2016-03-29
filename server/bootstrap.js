var csv = Npm.require('csv');
var fs = Npm.require('fs');

Meteor.startup(function(){

  function importHubs() {
    var hubs;

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
      hub.isSponsor = (hub.isSponsor == 'true') ? true : false;
      Hubs.insert(hub);
    });
  }

  function importOrigins() {
    var origins;

    Origins.remove({});

    Async.runSync(function(doneImportOrigins){
      rs = fs.createReadStream(process.env.PWD +'/data/origins.csv');
      var parser = csv.parse({columns: true}, function(err, data){
        if (err) return doneImportOrigins(err);
        origins = data;
        doneImportOrigins();
      });
      rs.pipe(parser);
    });

    _.each(origins, function(country){
      Origins.insert(country);
    });
  }

  function importNatures() {
    var natures;

    Natures.remove({});

    Async.runSync(function(doneImportNatures){
      rs = fs.createReadStream(process.env.PWD +'/data/natures.csv');
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

  if (Origins.find({}).count() != 0) importOrigins();
  // if (Natures.find({}).count() != 0) importNatures();
  if (Hubs.find({}).count() == 0) importHubs();

});
