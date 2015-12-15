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

exports.clearDb = function(doneClearDb) {
  async.series([function(cb){
    app.models.Hub.deleteAll(cb);
  }, function(cb) {
    app.models.Affiliation.deleteAll(cb);
  }, function(cb) {
    app.models.Method.deleteAll(cb);
  }, function(cb) {
    app.models.MethodType.deleteAll(cb);
  }], doneClearDb);
}

exports.importHubs = function(doneImportHubs){
  var Hub = app.models.Hub;

  async.eachSeries(data, function(record, doneEach){
    if (record["Definição"] == "Hub / Ator") {
      importHub(record, doneEach);
    } else doneEach();
  }, function(err){
    if (!err) console.log('Data imported successfully');
    doneImportHubs(err);
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
        // console.log(parentName);
        // console.log(parentId);

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


exports.loadMethods = function(doneLoadMethods) {
  var MethodType = app.models.MethodType;
  var Method = app.models.Method;

  var data = {
    "Diálogo": ["Assembléia", "Debate", "Mediação / Facilitação", "Roda de conversa"],
    "Mobilização": ["Pressão Social","Ação cívica","Ativismo digital","Abaixo-assinado","Campanha","Manifestação","Ocupação","Advocacy"],
    "Sensibilização": ["Artivismo/Revolução Estética","Culture jamming","Intervenção","Choque estético","Humor / Comédia","Atividades culturais"],
    "Formação": ["Pedagogia política","Oficina","Vivência","Pedagogia política","Jogo","Manual","Curso"],
    "Produção de Conhecimento": ["Produção de Conhecimento","Wiki","Pesquisa colaborativa e participativa","Index/Indicadores","Pesquisa","Estudos","Livros","Análise de dados","Relatório","Manual"],
    "Levantamento de dados": ["Open data","Banco de dados","Repositório","Big data"],
    "Visualização de dados": ["Dataviz","Georrefenciamento","Infográfico","Grafos de rede"],
    "Fomento": ["Fomento","Edital","Aceleradora","Financiamento Coletivo"],
    "Fiscalização": ["Controle social","Denúncia","Investigação","Monitoramento","Ação judicial de interesse público"],
    "Consulta": ["Consulta popular","Referendo","Plebiscito","Audiência Pública"],
    "Participação": ["Mandato interativo","Legislação participativa","Resident Feedback","Co-Criação","Votação","Crowdsourcing"],
    "Governo 2.0": ["Governo 2.0", "Serviço digital", "Design Thinking"],
    "Comunicação": ["Cobertura Colaborativa","Mídia de Guerrilha","Infoativismo"],
    "Conexão": ["Eventos","Seminário","Fórum","Colóquio","Festival","Desconferência","Conferência","Hackaton"]
  }

  async.eachSeries(Object.keys(data), function(type, doneType){
    var methodType = new MethodType({name_pt: type});
    methodType.save(function(err){
      if (err) return doneType(err);
      else
        async.eachSeries(data[type], function(methodName, doneEachMethod){
          var method = methodType.methods.build({name_pt: methodName});
          method.save(doneEachMethod);
          
        }, doneType);
    });
  }, doneLoadMethods);

}
