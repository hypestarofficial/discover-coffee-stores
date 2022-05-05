import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from '../../lib/airtable';

const createCoffeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, address, neighborhood, votes, imgUrl } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          if (name) {
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
            const records = getMinifiedRecords(createRecord);
            res.json({ records });
          } else {
            res.status(400);
            res.json({ message: 'Record is nameless' });
          }
        }
      } else {
        res.status(400);
        res.json({ message: 'Id not found' });
      }
    } catch (err) {
      console.error('Error creating or finding a store', err);
      res.status(500);
      res.json({ message: 'Error creating or finding a store', err });
    }
  }
};

export default createCoffeStore;
