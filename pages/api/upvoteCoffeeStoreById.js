import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from '../../lib/airtable';

const upvoteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];
          const calculateVotes = parseInt(record.votes) + 1;

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                votes: calculateVotes,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords);
          }
        } else {
          res.json({ message: `Id not found` });
        }
      } else {
        res.status(400);
        res.json({ message: 'Id not found' });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: 'Oops, something went wrong' }, error);
    }
  } else {
    res.status(400);
    res.json({ message: 'Not a PUT method' });
  }
};

export default upvoteCoffeeStoreById;
