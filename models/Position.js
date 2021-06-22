const mongoose = require('mongoose')
const Schema = mongoose.Schema

//создаем/описываем схему таблицы/коллекции
const positionSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    cost:{
        type: Number,
        required: true
    },
    category: {
        //это внешний ключ
        ref: 'category',
        type: Schema.Types.ObjectId
    },
    user: {
        //это внешний ключ
        ref: 'user',
        type: Schema.Types.ObjectId
    }
})
//экспортируем нашу схему/создаем коллекцию(таблицу) с названием категориес
module.exports = mongoose.model('positions', positionSchema)