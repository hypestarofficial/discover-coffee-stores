const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'keyAKOsECACNSvuG9' }).base(
  'appAdezBsaRoPKlXo'
);

const table = base('coffee-stores');

const createCoffeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, address, neighborhood, votes, imgUrl } = req.body;

    try {
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id=${id}`,
        })
        .firstPage();

      console.log({ findCoffeeStoreRecords });

      if (findCoffeeStoreRecords.length !== 0) {
        const records = findCoffeeStoreRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      } else {
        const createRecord = await table.create([
          {
            fields: {
              id,
              name,
              address,
              neighborhood,
              votes,
              imgUrl,
            },
          },
        ]);
        const records = createRecord.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json({ records });
      }
    } catch (err) {
      console.error('Error finding store', err);
      res.status(500);
      res.json({ message: 'Error finding store', err });
    }
  }
};

export default createCoffeStore;
