const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'keyAKOsECACNSvuG9' }).base(
  'appAdezBsaRoPKlXo'
);

const table = base('coffee-stores');

const getMinifiedRecord = (record) => {
  return {
    ...record.fields,
  };
};

const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordByFilter };
