const { uuid } = require('uuidv4');
const knex = require("../knex.js");

exports.viewModelStat = async (data) => {
  knex.from('Stats')
  .insert({
    statId: uuid(),
    modelId: data.modelId,
    manufactoryId: data.manufactoryId
}).catch(e => { return { status: 'fail', error: e } })
}
