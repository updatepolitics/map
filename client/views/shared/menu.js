Template.menu.helpers({
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
          "page": "page.list",
          "_pt": "PAGES",
        }]
    }
  },
  generalMenu: function(){
    return [
      {
        "page": "home",
        "_pt": "INÍCIO"
      }, {
        "page": "about",
        "_pt": "UPDATE",
        "_en": "UPDATE",
        "submenu": [{
          "anchor": "intro",
          "_pt": "Sobre o Update",
        }, {
          "anchor": "who",
          "_pt": "Quem somos",
        }, {
          "anchor": "partners",
          "_pt": "Quem nos financia + parceiros",
        }]
      }, {
        "page": "methodology",
        "_pt": "METODOLOGIA",
        "_en": "METHODOLOGY",
      }, {
        "_pt": "PAÍSES",
        "_en": "COUNTRIES",
        "page": "countries",
        "submenu": [{
          "anchor": "intro",
          "_pt": "Introdução / O que é",
        }, {
          "anchor": "countries",
          "_pt": "Paises/Iniciativas",
        }, {
          "anchor": "coverage",
          "_pt": "Abrangência",
        }]
      }, {
        "page": "hubs",
        "_pt": "HUBS",
        "_en": "HUBS",
        "submenu": [{
          "anchor": "intro",
          "_pt": "Introdução / O que é",
        }, {
          "anchor": "kind",
          "_pt": "Natureza",
        }, {
          "anchor": "financer",
          "_pt": "Financiador",
        }]
      }, {
        "_pt": "SINAIS",
        "_en": "SIGNALS",
        "page": "signals",
        "submenu": [{
          "anchor": "intro",
          "_pt": "Introdução / O que é",
        }, {
          "anchor": "tech",
          "_pt": "Tecnologia",
        }, {
          "anchor": "theme",
          "_pt": "Temas",
        }, {
          "anchor": "purpose",
          "_pt": "Propósito",
        }, {
          "anchor": "method",
          "_pt": "Métodos",
        }]
      }, {
        "page": "download",
        "_pt": "DOWNLOAD",
        "html": "download.html",
      }, {
        "page": "register",
        "_pt": "CADASTRE SUA INICIATIVA",
      }, {
        "_pt": "EXPLORAR",
        "_en": "EXPLORE",
        "submenu": [{
          "_pt": "GRÁFICO",
          "page": "chart"
        }, {
          "_pt": "LISTA",
          "page": "list",
        }]
      }]
    }
});
