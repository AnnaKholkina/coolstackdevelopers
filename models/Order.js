const mongoose = require('mongoose')
const Schema = mongoose.Schema

//создаем/описываем схему таблицы/коллекции
const orderSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    order: {
        type: Number,
        required: true
    },
    list:[{
        name:{
            type: String
        },
        quantity:{
            type: Number
        },
        cost: {
            type: Number
        }
    }],
    user:{
        ref: 'user',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('orders', orderSchema)