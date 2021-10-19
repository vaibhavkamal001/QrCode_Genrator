const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PersonSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    state:{
        type:String,
        require:true
    },
});

module.exports = mongoose.model('persondetail',PersonSchema)