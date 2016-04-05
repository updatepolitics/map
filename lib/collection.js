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
      optional: false
  },
  description_es: {
      type: String,
      label: "Description: Spanish",
      optional: false
  },
  description_pt: {
      type: String,
      label: "Description: Portuguese",
      optional: false
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
      optional: false
  },
  description_es: {
      type: String,
      label: "Description: Spanish",
      optional: false
  },
  description_pt: {
      type: String,
      label: "Description: Portuguese",
      optional: false
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
      optional: false
  },
  description_es: {
      type: String,
      label: "Description: Spanish",
      optional: false
  },
  description_pt: {
      type: String,
      label: "Description: Portuguese",
      optional: false
  }
});
Mechanisms.attachSchema(Schemas.Mechanism);
