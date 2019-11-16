export const ProductTypes = {
  SOLAR_PANEL: 'Solar Panel',
  INVERTER: 'Inverter',
  BATTERY: 'Battery'
};

export const ProductTypeByID = {
  SOLAR_PANEL: '0120w0000007iS8AAI',
  INVERTER: '0120w0000007iSDAAY',
  BATTERY: '0120w0000007iSIAAY'
};

export const SystemImageTypes = {
  SOLAR_PANEL_LAYOUT: 'Solar Panel Layout',
  CUSTOMER_SIGNATURE: 'Customer Signature'
};

export const OpportunityRecordType = {
  SOLAR_SYSTEM: 'Solar_System_S',
  BATTERY: 'Battery',
  SOLAR_BATTERY: 'Solar_Battery_SB',
  GENERIC: 'Generic_Opportunity'
}

export const validURL = (str = '') => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
};
