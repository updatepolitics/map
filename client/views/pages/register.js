Template.register.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.register.onDestroyed(function (){
  $('body').removeClass('light_bg')
});

Template.register.events({
  "click #send_register": function(event, template){
    event.preventDefault();
    var instance = Template.instance();
    var resultMessage = 'Not implemented.';

    // freeze inputs
    instance.$('input').prop("readonly", true);
    instance.$('textarea').prop("readonly", true);

    // change send button
    var sendButton = instance.$('div#send_register');
    sendButton.html(TAPi18n.__('register.sending'));

    // get inputs
    var name = instance.$('input#name').val();
    var email = instance.$('input#email').val();
    var city = instance.$('input#city').val();
    var country = instance.$('input#country').val();
    var description = instance.$('textarea#description').val();

    // validate form
    var validForm = true;
    if (!email || email == '') {
      validForm = false;
      resultMessage = TAPi18n.__('register.emailMissing');
    } else if (!isValidEmailAddress(email)) {
      validForm = false;
      resultMessage = TAPi18n.__('register.emailInvalid');
    } else if (description == '') {
      validForm = false;
      resultMessage = TAPi18n.__('register.descriptionMissing');
    }

    var mailBody =
      'Nome: ' + name + '\n' +
      'Email: ' + email + '\n' +
      'Cidade: ' + city + '\n' +
      'País: ' + country + '\n' +
      'Descrição: \n\n' + description;

    if (validForm) {

      var mailData = {
        'text': mailBody,
        'subject': 'Pedido de registro de iniciativa'
      }

      Meteor.call('send', mailData, function (error, result) {
        if (!result.error) {
          // unfreeze form
          instance.$('input').prop("readonly", false).val('');
          instance.$('textarea').prop("readonly", false).val('');
          resultMessage = TAPi18n.__('register.success');
        } else {
          resultMessage = TAPi18n.__('register.error');
        }

        sendButton.html(resultMessage);

        // reset form after 3 secs
        setTimeout(function(){
          sendButton.html(TAPi18n.__('send'));
        }, 3000)
      });
    } else {
      sendButton.html(resultMessage);

      // unfreeze form after 3 secs
      setTimeout(function(){
        instance.$('input').prop("readonly", false);
        instance.$('textarea').prop("readonly", false);
        sendButton.html('Enviar');
      }, 3000);
    }
  }
});

var isValidEmailAddress = function ( emailAddress ) {
		// http://stackoverflow.com/a/46181/11236
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test( emailAddress );
}
