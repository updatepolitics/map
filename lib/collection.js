/*
 * Origins
 */

var Schemas = {};

Origins = new Mongo.Collection("origins");
Schemas.Origin = new SimpleSchema({
  en: {
      type: String,
      label: "Name",
      max: 200,
      optional: false
  },
  es: {
      type: String,
      label: "Nombre",
      max: 200,
      optional: false
  },
  pt: {
      type: String,
      label: "Nome",
      max: 200,
      optional: false
  },
  type: {
      type: String,
      optional: false
  }
});
Origins.attachSchema(Schemas.Origin);

/*
 * IncidencyReachs
 */

var Schemas = {};


/*
* Incidency reach
*/

IncidencyReachs = new Mongo.Collection("incidencyReach");
Schemas.IncidencyReach = new SimpleSchema({
  en: {
      type: String,
      label: "Incidency reach",
      max: 200,
      optional: false
  },
  es: {
      type: String,
      label: "Alcance de incidencia",
      max: 200,
      optional: false
  },
  pt: {
      type: String,
      label: "Alcande de incidência",
      max: 200,
      optional: false
  }
});
IncidencyReachs.attachSchema(Schemas.IncidencyReach);

/*
* Incidency type
*/

IncidencyTypes = new Mongo.Collection("incidencyTypes");
Schemas.IncidencyType = new SimpleSchema({
  en: {
      type: String,
      label: "Incidency type",
      max: 200,
      optional: false
  },
  es: {
      type: String,
      label: "Tipo de incidencia",
      max: 200,
      optional: false
  },
  pt: {
      type: String,
      label: "Tipo de incidência",
      max: 200,
      optional: false
  }
});
IncidencyTypes.attachSchema(Schemas.IncidencyType);

/*
* Purpose
*/

Purposes = new Mongo.Collection("purposes");
Schemas.Purpose = new SimpleSchema({
  en: {
      type: String,
      label: "Purpose",
      max: 200,
      optional: false
  },
  es: {
      type: String,
      label: "Propósito",
      max: 200,
      optional: false
  },
  pt: {
      type: String,
      label: "Propósito",
      max: 200,
      optional: false
  }
});
Purposes.attachSchema(Schemas.Purpose);

/*
* Hub
*/

Hubs = new Mongo.Collection("hubs");
Schemas.Hub = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    website: {
      type: String,
      // regEx: SimpleSchema.RegEx.Url,
      optional: true
    },
    city: {
      type: String,
      label: "City",
      max: 100,
      optional: true
    },
    origin: {
      type: String,
      optional: true
    },
    placesOfOrigin: {
      type: [String],
      optional: true,
      autoform: {
        afFieldInput: {
          label: "Places of origin",
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    incidencyReach: {
      type: String
    },
    nature: {
      type: String,
    },
    isSponsor: {
      type: Boolean,
      defaultValue: false
    },
    relatedHubs: {
      optional: true,
      type: [String],
      label: "Related Hubs",
      autoform: {
        afFieldInput: {
          label: "Related hubs",
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    parentHubs: {
      optional: true,
      type: [String],
      label: "Parent Hubs",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    description_en: {
        type: String,
        label: "Description (en)",
        optional: true,
        max: 2000
    },
    description_pt: {
        type: String,
        label: "Description (pt)",
        optional: true,
        max: 2000
    },
    description_es: {
        type: String,
        label: "Description (es)",
        optional: true,
        max: 2000
    }
});
Hubs.attachSchema(Schemas.Hub);


/*
* Natures
*/

Natures = new Mongo.Collection("natures");
Schemas.Nature = new SimpleSchema({
  en: {
      type: String,
      label: "Name",
      max: 200,
      optional: false
  },
  es: {
      type: String,
      label: "Nombre",
      max: 200,
      optional: true
  },
  pt: {
      type: String,
      label: "Nome",
      max: 200,
      optional: true
  },
  description_en: {
      type: String,
      label: "Description: English",
      optional: true
  },
  description_es: {
      type: String,
      label: "Description: Spanish",
      optional: true
  },
  description_pt: {
      type: String,
      label: "Description: Portuguese",
      optional: true
  }
});
Natures.attachSchema(Schemas.Nature);


/*
* Themes
*/

Themes = new Mongo.Collection("themes");
Schemas.Theme = new SimpleSchema({
  en: {
      type: String,
      label: "Name",
      max: 200,
      optional: true
  },
  es: {
      type: String,
      label: "Nombre",
      max: 200,
      optional: true
  },
  pt: {
      type: String,
      label: "Nome",
      max: 200,
      optional: true
  },
  description_en: {
      type: String,
      label: "Description: English",
      optional: true
  },
  description_es: {
      type: String,
      label: "Description: Spanish",
      optional: true
  },
  description_pt: {
      type: String,
      label: "Description: Portuguese",
      optional: true
  }
});
Themes.attachSchema(Schemas.Theme);

/*
* Mechanisms
*/

Mechanisms = new Mongo.Collection("mechanisms");
Schemas.Mechanism = new SimpleSchema({
  en: {
      type: String,
      label: "Name",
      max: 200,
      optional: true
  },
  es: {
      type: String,
      label: "Nombre",
      max: 200,
      optional: true
  },
  pt: {
      type: String,
      label: "Nome",
      max: 200,
      optional: true
  },
  description_en: {
      type: String,
      label: "Description: English",
      optional: true
  },
  description_es: {
      type: String,
      label: "Description: Spanish",
      optional: true
  },
  description_pt: {
      type: String,
      label: "Description: Portuguese",
      optional: true
  }
});
Mechanisms.attachSchema(Schemas.Mechanism);

/*
* Methods
*/

Methods = new Mongo.Collection("methods");
Schemas.Method = new SimpleSchema({
  en: {
      type: String,
      label: "Name",
      max: 200,
      optional: true
  },
  es: {
      type: String,
      label: "Nombre",
      max: 200,
      optional: true
  },
  pt: {
      type: String,
      label: "Nome",
      max: 200,
      optional: true
  },
  mechanism: {
      type: String,
      optional: false
  },
  description_en: {
      type: String,
      label: "Description: English",
      optional: true
  },
  description_es: {
      type: String,
      label: "Description: Spanish",
      optional: true
  },
  description_pt: {
      type: String,
      label: "Description: Portuguese",
      optional: true
  }
});
Methods.attachSchema(Schemas.Method);


/*
* Signal
*/

Signals = new Mongo.Collection("signals");
Schemas.Signal = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
    },
    website: {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true
    },
    city: {
      type: String,
      label: "City",
      max: 100,
      optional: true
    },
    origin: {
      type: String,
      optional: true
    },
    placesOfOrigin: {
      type: [String],
      optional: true,
      autoform: {
        afFieldInput: {
          label: "Places of origin",
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    incidencyReach: {
      type: String
    },
    incidencyTypes: {
      optional: true,
      type: [String],
      label: "Incidency types",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    parentHubs: {
      optional: true,
      type: [String],
      label: "Parent Hubs",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    technologyType: {
      type: String,
      label: "Type",
      optional: false
    },
    purpose: {
      type: String,
      label: "Purpose",
      optional: false
    },
    methods: {
      optional: true,
      type: [String],
      label: "Methods",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    mainThemes: {
      optional: true,
      type: [String],
      label: "Main themes",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    secondaryThemes: {
      optional: true,
      type: [String],
      label: "Secondary themes",
      autoform: {
        afFieldInput: {
          type: 'select',
          search: true,
          multiple: true
        }
      }
    },
    isOpenLicense: {
      type: Boolean,
      optional: true
    },
    notes: {
      type: String,
      label: "Notes",
      optional: true,
      max: 2000
    },
    description_pt: {
        type: String,
        label: "Description (pt)",
        optional: true,
        max: 2000
    },
    description_en: {
        type: String,
        label: "Description (en)",
        optional: true,
        max: 2000
    },
    description_es: {
        type: String,
        label: "Description (es)",
        optional: true,
        max: 2000
    }
});
Signals.attachSchema(Schemas.Signal);
