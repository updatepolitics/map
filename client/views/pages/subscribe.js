Template.subscribe.onCreated(function() {
  $("body").addClass("light_bg");
});

Template.subscribe.onDestroyed(function() {
  $("body").removeClass("light_bg");
});

var isValidEmailAddress = function(emailAddress) {
  // http://stackoverflow.com/a/46181/11236
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailAddress);
};

var submitEvent = function(event, template) {
  event.preventDefault();
  var email = $("#user_email").val();

  if (email == "") return;

  if (!isValidEmailAddress(email)) {
    $("#user_email")
      .val(TAPi18n.__("mailing.error.InvalidEmail"))
      .prop("readonly", true);

    setTimeout(function() {
      $("#user_email")
        .val(email)
        .prop("readonly", false);
    }, 3000);
  } else {
    $("#user_email")
      .val(TAPi18n.__("pleaseWait"))
      .prop("readonly", true);

    var mailChimp = new MailChimp();
    mailChimp.call(
      "lists",
      "subscribe",
      {
        email: {
          NOME: "undefined",
          email: email,
          IDIOMA: TAPi18n.getLanguage()
        }
      },
      function(err, result) {
        if (err) {
          switch (err.error) {
            case 214: // 'List_AlreadySubscribed'
              var message = TAPi18n.__("mailing.error.AlreadySubscribed");
              break;
            default:
              var message = error.reason;
          }

          $("#user_email")
            .val(message)
            .prop("readonly", true);

          setTimeout(function() {
            $("#user_email")
              .val(email)
              .prop("readonly", false);
          }, 3000);
        } else {
          var message = TAPi18n.__("mailing.success.Subscribed");

          $("#user_email")
            .val(message)
            .prop("readonly", true);

          setTimeout(function() {
            $("#user_email")
              .val("")
              .prop("readonly", false);
          }, 3000);
        }
      }
    );
  }
};

Template.subscribe.events({
  "click #send_email": submitEvent,
  "submit #send_email_form": submitEvent
});
