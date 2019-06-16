var mongoose=require('mongoose');
var faultformsSchema=require('../schemas/faultforms');

module.exports = mongoose.model('Faultform',faultformsSchema);