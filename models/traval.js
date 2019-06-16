var mongoose=require('mongoose');
var travalsSchema=require('../schemas/travals');

module.exports = mongoose.model('Traval',travalsSchema);