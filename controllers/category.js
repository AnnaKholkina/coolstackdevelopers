const Category = require('../models/Category')
const errorHandler = require('../utils/errorHandler')
const Position = require('../models/Position')

module.exports.create = async function (req, res){

    const category = new Category({
        name: req.body.name,
        user: req.user.id,
        imageSrc: req.file? req.file.path : ''
    })
    try{
        await category.save()
        res.status(201).json(category)
    }
    catch (e){
        errorHandler(res, e)
    }
}

module.exports.getAll = async function (req, res){

    try{
        const categories = await Category.find({user: req.user.id}) //берем только то, что добавил пользоваетль
        res.status(200).json(categories) //.json(categories)
    }
    catch (e){

        errorHandler(res, e)
    }
}

module.exports.getById = async function (req, res){
    try{
        const category = await Category.findById(req.params.id) //берем конкретную категорию
        
        res.status(200).json(category)
    }
    catch (e){
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res){
    try{
        await Category.remove({_id: req.params.id}) //удаляем конкрентую категорию
        await Position.remove({category: req.params.id}) //нам надо так же удалить все позиции из категории
        res.status(200).json({message: 'Категория была удалена.'})
    }
    catch (e){
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res){
    const updated = {
        name: req.body.name
    }
    if (req.file){
        updated.imageSrc = req.file.path
    }
    try{
        const category = await Category.findOneAndUpdate(
            {_id:req.params.id},
            {$set: updated},
            {new: true}
            )
        res.status(200).json(category)
    }
    catch (e){
        errorHandler(res, e)
    }
}