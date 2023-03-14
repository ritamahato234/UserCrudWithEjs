const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required: [true, 'phone should in number']
    },
    image:{
        type: String,
        required:true
    },

},
{
    timestamps:true,
})

module.exports = mongoose.model('User', userSchema);