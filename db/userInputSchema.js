const mongoose = require('mongoose');

const schema= new mongoose.Schema({
    domainName:{
        type:String,
        required: true,
    },
});

const userInputModel = mongoose.model('userInputs', schema);

module.exports = userInputModel;
