const mongoose = require('mongoose')
/**
 * LN node status model
 */
const statusSchema = new mongoose.Schema({
  id: String,
  event: String,
  type: String,
  address: String,
  port: Number
});

module.exports = mongoose.model('Status', statusSchema)