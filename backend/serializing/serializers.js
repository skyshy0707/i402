const db = require('../db/models/index')
const Serializer = require('./serializer')
const { 
    lessonCreateResponse, 
    lessonGetResponse, 
    lessonUnpaidResponse, 
    lessonView
} = require('./schemes')


class ListSerializer{

    constructor(serialzier){
        this.serializer = serialzier
    }

    serializeMany(items){
        let cache = {}, objects = []

        for (let item of items){
            objects.push(
                this.serializer.serialize(item, cache)
            )
        }
        return objects
    }
}

const lessonCreateSerializer = new Serializer(db.Lesson, lessonCreateResponse)
const lessonGetSerializer = new Serializer(db.Lesson, lessonGetResponse)
const lessonUnpaidSerializer = new Serializer(db.Lesson, lessonUnpaidResponse)
const lessonViewSerializer = new Serializer(db.Lesson, lessonView)
const lessonListSerializer = new ListSerializer(lessonViewSerializer)

module.exports = {
    lessonCreateSerializer,
    lessonGetSerializer,
    lessonUnpaidSerializer,
    lessonListSerializer
}