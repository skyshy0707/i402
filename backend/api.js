const { Base64 } = require("js-base64")
const cors = require('cors')
const express = require('express')
const fileupload = require("express-fileupload")
const helmet = require('helmet')
const multer  = require('multer')
const path = require('node:path')

const db = require('./db/models/index')
const { generateFileName, generateHtml, lessonSavingPath } = require('./utils/fromTextToHtml')
const { lessonUnpaidInfo, paginateResponseData } = require('./serializing/schemes')
const { 
  lessonCreateSerializer, 
  lessonGetSerializer,
  lessonUnpaidSerializer,
  lessonListSerializer
} = require('./serializing/serializers')
const send = require('./utils/USDCSender')

const app = express()
const corsOptions = {
  origin: [
    "http://127.0.0.1:9001"
  ]
}
const LIMIT = 10
const URL_API = 'http://127.0.0.1:9007/'
const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, path.join(__dirname, lessonSavingPath))
  },
  filename: (request, file, cb) => {
    cb(
      null, 
      generateFileName(file.originalname)
    )
  }
})
const upload = multer({ storage: storage })
const uploadMiddleware = upload.single('content_data')

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static(path.join(__dirname, lessonSavingPath)))
app.use(uploadMiddleware)


app.get('/api/lessons', async (req, res) => {

  let offset = parseInt(req.query.offset)
  let limit = parseInt(req.query.limit) || LIMIT

  const lessonInstances = await db.Lesson.findAll({ offset: offset, limit: limit })
  const lessons = lessonListSerializer.serializeMany(lessonInstances)

  return res.status(200).json({
    items: lessons,
    ...paginateResponseData(await db.Lesson.count(), limit, offset)
  })
})

app.get('/api/lesson/:id', async (req, res) => {
  console.log(`lesson id: ${req.params.id}`)

  const lessonResult = await db.Lesson.findByPk(req.params.id)
  const lessonUnpaid = lessonUnpaidSerializer.serialize(lessonResult)
  var xPayment = JSON.parse(req.headers['x-payment'])

  const unpaidResponseData = { 
    message: "Payment required",
    payment: { info: lessonUnpaidInfo, free: lessonUnpaid } 
  }
  
  if (!xPayment) {
    return res.status(402).json(unpaidResponseData);
  }
  for (let key of Object.keys(xPayment)){
    xPayment[key] = Base64.decode(xPayment[key])
  }

  // … проверка платежа, верификация, если всё ок: 

  try{
    await send(xPayment.signature, xPayment.price)
  }
  catch(error){
    return res.status(402).json(unpaidResponseData)
  }
  
  const lesson = lessonGetSerializer.serialize(lessonResult)
  return res.status(200).json({ message: 'Success', result: lesson });
});

app.post('/api/lesson/create', async (req, res) => {
    let instance
    const file = req.file
    const lesson = req.body

    console.log(`Lesson.content-type: ${lesson.content_type}`)

    if (file){
      lesson.content_data = URL_API + file.filename
    }
    if (lesson.content_type == 'text'){
      let filename = await generateHtml(lesson.content_data)
      lesson.content_data = URL_API + filename
    }
    
    try {
      instance = await db.Lesson.create(lesson)
    }
    catch (error) {

      return res.status(400).json(
        { 
          error: "Bad Request", 
          message: error 
        }
      )
    }
    
    return res.status(201).json(
      lessonCreateSerializer.serialize(instance)
    )
})

app.listen(8000, () => {
  console.log("Now I'm ready to take requests")
})