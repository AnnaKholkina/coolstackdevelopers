const mongoose = require('mongoose')
const Schema = mongoose.Schema

//создаем/описываем схему таблицы/коллекции
const categorySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    imageSrc:{
        type: String,
        default: ''
    },
    user: {
        //это внешний ключ
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})
//экспортируем нашу схему/создаем коллекцию(таблицу) с названием категориес
module.exports = mongoose.model('categories', categorySchema)