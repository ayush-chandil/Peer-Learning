const Log = require('../../models/log')
const { Parser } = require('json2csv')

const fields = [
  {
    label: 'USER ID',
    value: 'user_id',
  },
  {
    label: 'EVENT TYPE',
    value: 'event_type',
  },
  {
    label: 'REFERENCE ID',
    value: 'reference_id',
  },
  {
    label: 'DESCRIPTION',
    value: 'description',
  },
  {
    label: 'TIME STAMP',
    value: 'time_stamp',
  },
]

exports.getLogs = function (req, res) {
  Log.find((err, result) => {
    if (err) {
      res.json(err)
    } else {
      const json2csvParser = new Parser({ fields })
      const csv = json2csvParser.parse(result)
      res.setHeader('Content-disposition', 'attachment; filename=Logs.csv')
      res.set('Content-Type', 'text/csv')
      res.status(200).send(csv)
    }
  })
}
