Template.adminMenu.helpers({
  adminMenu: function() {
    return {
        _en: "ADMIN",
        _es: "ADMININISTRAR",
        _pt: "ADMINISTRAR",
        menuItems: [{
          "page": "hub.list",
          "_pt": "HUBS",
        }, {
          "page": "nature.list",
          "_pt": "NATURES",
        }, {
          "page": "theme.list",
          "_pt": "THEMES",
        }, {
          "page": "mechanism.list",
          "_pt": "MECHANISMS",
        }, {
          "page": "method.list",
          "_pt": "METHODS",
        }, {
          "page": "signal.list",
          "_pt": "SIGNALS",
        }, {
          "page": "method.list",
          "_pt": "USERS",
        }]
    }
  }
});
