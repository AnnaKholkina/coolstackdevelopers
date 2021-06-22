//Базовая конфигурация для загрузки файлов

const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads')//куда сохраняем ошибки
    },
    filename(req, file, cb){
        const date = moment().format('DDMMYYYY-HHmmss_SSS')//когда сохраняем
        cb(null, `${date}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){ //проверка на тип картинки
        cb(null, true)//фильтр пройден
    }
    else{
        cb(null, false)
    }
}

const limits = { //размер картинок
    fileSize: 1024*1024*5
}

module.exports = multer({ //элемент конфигурации
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
})