const mongoose = require('mongoose')

const {Schema} = mongoose


const requiredString = {
    type:String,
    required:true
}

const requiredNumber = {
    type:Number,
    required:true
}

const logEntrySchema = new Schema({

    title: requiredString,
    comments:String,
    rating: {
        type:Number,
        min:0,
        max:5
    },
    image:String,
    latitude:{
        ...requiredNumber,
        min:-90,
        max:90
    },
    longitude:{
        ...requiredNumber,
        min:-180,
        max:180
    },
    visitDate:{
        required:true,
        type:Date
    }
},
   {timestamps:true}
)

module.exports = mongoose.model("LogEntry", logEntrySchema);