Template.registerHelper("formType", function(){
  if(_.isEmpty(this)) {
    return 'insert'
  } else {
    return 'update';
  }
});

Template.registerHelper("originsOptions", function(){
  return Origins.find({}, {sort: {en: 1}}).map(function (c) {
    return {label: c.en, value: c._id};
  });
});

Template.registerHelper("hubsOptions", function(){
  var result = [];
  Hubs.find({}, {sort: {name: 1}, fields: {name: 1}}).forEach(function (h) {
    result.push({label: h.name, value: h._id});
  });
  return result;
});

Template.registerHelper("natureOptions", function(){
  return Natures.find({}, { sort: {en: 1} }).map(function (n) {
    return {label: n.en, value: n._id};
  });
});

Template.registerHelper("incidencyReachOptions", function(){
  return IncidencyReachs.find({}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});

Template.registerHelper("incidencyTypeOptions", function(){
  return IncidencyTypes.find({}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});

Template.registerHelper("purposeOptions", function(){
  return Purposes.find({}, {sort: {en: 1}}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});

Template.registerHelper("themesOptions", function(){
  return Themes.find({}, {sort: {en: 1}}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});

Template.registerHelper("methodOptions", function(){
  return Methods.find({}, {sort: {en: 1}}).map(function (h) {
    return {label: h.en, value: h._id};
  });
});

Template.registerHelper("technologyTypeOptions", function(){
  return _.map(['Digital', 'Social'], function (i) {
    return {label: i, value: i};
  });
});

Template.registerHelper("mechanismOptions", function(argument){
  return Mechanisms.find({}, {sort: {en: 1}}).map(function (c) {
    return {label: c.en, value: c._id};
  });
});
