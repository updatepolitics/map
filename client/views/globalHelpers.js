Template.registerHelper("originsOptions", function(argument){
  return Origins.find({}, {sort: {en: 1}}).map(function (c) {
    return {label: c.en, value: c._id};
  });
});

Template.registerHelper("hubsOptions", function(argument){
  var result = [];
  Hubs.find({}, {sort: {name: 1}, fields: {name: 1}}).forEach(function (h) {
    result.push({label: h.name, value: h._id});
  });
  return result;
});

Template.registerHelper("natureOptions", function(argument){
  return Natures.find({}, { sort: {en: 1} }).map(function (n) {
    return {label: n.en, value: n._id};
  });
});

Template.registerHelper("incidencyReachOptions", function(argument){
  return IncidencyReachs.find({}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});
