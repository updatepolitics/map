var csv = Npm.require('csv');
var fs = Npm.require('fs');

// Collections
var HubNature = new Mongo.Collection("hubNatures");

Meteor.startup(function(){

  console.log(process.env);
  // console.log('lalalal');

  function importHubNature() {
    HubNature.remove({});

    // [name_pt, plural, institutional]
    var natures = [
      ["Indivíduo",false,false],
      ["Instituto, Fundação",true,true],
      ["Empresa",true,true],
      ["Partido",true,true],
      ["Organismo multilateral / Internacional",true,true],
      ["Orgão Governamental",true,true],
      ["ONG",true,true],
      ["Academia",true,true],
      ["Não Identificada",true,true],
      ["Coletivo",true,false],
      ["Movimento",true,false],
      ["Aliança (a+a)",true,false],
      ["Rede (p2p)",true,false],
      ["Parceria (a+b)",true,false]
    ];

    _.each(natures, function(nature) {
      HubNature.insert({
        name_pt: nature[0],
        isPlural: nature[1],
        isInstitution: nature[2]
      });
    });
  }

  importHubNature();

});
