const { 
    ConnectionAcquireTimeoutError,
    ConnectionRefusedError,
    DatabaseError,
    UniqueConstraintError
} = require('sequelize')

const db = require('./models/index')


const contentTypes = [
    { title: 'pdf' }, { title: 'text' }, { title: 'video' }, { title: 'url' }
]

const initialize = () => { 
    return new Promise((resolve, reject) => {
        
        db.sequelize.authenticate().then(
            () => {
                console.log("Autheticate was success")

                try{
                    db.sequelize.sync().then(
                        () => {
                            for (let contentType of contentTypes){
                                try{
                                    db.ContentType.create(contentType)
                                }
                                catch(error){
                                    if (error instanceof UniqueConstraintError){
                                        continue
                                    }
                                }
                            }
                        }
                    )
                    resolve()
                }
                catch(error){
                    reject(error)
                }
            }
        ).catch((error) => {
            console.log(`Невозможно установить соединение. Details: ${error}`)
        })


        
    })   
}

initialize()