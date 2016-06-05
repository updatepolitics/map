Template.download.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.download.onDestroyed(function (){
  $('body').removeClass('light_bg')
});

Template.download.events({
  "click #download_hubs": function(event, template){
    var nameFile = 'hubs.csv';
    Meteor.call('downloadHubs', function(err, fileContent) {
      try {
        if(fileContent){
          // var blob = Modules.client.convertBase64ToBlob( fileContent );
          var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
          saveAs(blob, nameFile);
        }
      } catch (e) {
        console.log('e');
        console.log(e);
      }

    });
  }
});
