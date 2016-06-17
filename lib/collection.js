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
  },
  level: {
    type: Number
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
* Technology type
*/

TechnologyTypes = new Mongo.Collection("technologyTypes");
Schemas.TechnologyType = new SimpleSchema({
  en: {
      type: String,
      label: "Technology type",
      max: 200,
      optional: false
  },
  es: {
      type: String,
      label: "Tipo de tecnologia",
      max: 200,
      optional: false
  },
  pt: {
      type: String,
      label: "Tipo de tecnologia",
      max: 200,
      optional: false
  }
});
TechnologyTypes.attachSchema(Schemas.TechnologyType);

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
  },
  color: {
      type: String
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
  },
  color: {
      type: String
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
