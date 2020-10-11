const mongoose = require('mongoose')
const storageModel = new mongoose.Schema({
    user_id: {type: String, required: true},
    key: {type: String, required: true},
    data: {type: String,required: true},
    create_at: {type: Date, default: new Date},
    update_at: {type: Date, required: true},
})
module.exports = mongoose.model('storageModel', storageModel)
