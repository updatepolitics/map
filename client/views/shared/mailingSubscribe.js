var isValidEmailAddress = function ( emailAddress ) {
		// http://stackoverflow.com/a/46181/11236
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test( emailAddress );
}

var submitEvent = function(event, template) {
  event.preventDefault();
  var email = $('#newsletter_email').val();

  if (email == '') return;

  if (!isValidEmailAddress(email)) {
    $('#newsletter_email')
      .val(TAPi18n.__('mailing.error.InvalidEmail'))
      .prop("readonly", true);

    setTimeout(function(){
      $('#newsletter_email')
        .val(email)
        .prop("readonly", false);
    }, 3000)
  } else {

    $('#newsletter_email')
      .val(TAPi18n.__('pleaseWait'))
      .prop("readonly", true);

    var mailChimp = new MailChimp();
    mailChimp.call('lists', 'subscribe', {
      email: {
        NOME: 'undefined',
        email: email,
        IDIOMA: TAPi18n.getLanguage()
      }
    }, function(err, result){
      if (err) {
        switch ( err.error ) {
          case 214:	// 'List_AlreadySubscribed'
            var message = TAPi18n.__('mailing.error.AlreadySubscribed');
            break;
          default:
            var message = error.reason;
        }

        $('#newsletter_email')
          .val(message)
          .prop("readonly", true);

        setTimeout(function(){
          $('#newsletter_email')
            .val(email)
            .prop("readonly", false);
        }, 3000);

      } else {
          var message = TAPi18n.__('mailing.success.Subscribed');

          $('#newsletter_email')
            .val(message)
            .prop("readonly", true);

          setTimeout(function(){
            $('#newsletter_email')
              .val('')
              .prop("readonly", false);
          }, 3000);
      }
    });
  }
}

Template.mailingSubscribe.events({
  "click #send_newsletter": submitEvent,
  "submit #home_newsletter": submitEvent
});
