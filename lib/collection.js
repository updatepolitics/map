HubNatureCollection = new Mongo.Collection("hubNatures");

/*
 * Schemas
 */

var Schemas = {};

Countries = new Mongo.Collection("countries");
Schemas.Country = new SimpleSchema({
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
  }
});
Countries.attachSchema(Schemas.Country);


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
    country: {
      type: String
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
