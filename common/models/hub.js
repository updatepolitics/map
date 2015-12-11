module.exports = function(Hub) {

  Hub.validatesInclusionOf('incidenceReach', {in: ['local', 'regional', 'national', 'international']});

};
