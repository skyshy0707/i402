const { createHash } = require('node:crypto')
const fs = require('node:fs/promises')
const path = require('node:path')

const lessonSavingPath = 'static/uploads/lessons'

function generateFileName(originalname){
    return Date.now() 
     + createHash('sha1').update(originalname, 'utf8').digest('hex')
     + path.extname(originalname)
}


async function generateHtml(data){
    let filename = generateFileName(Math.random().toString(18).substring(2) + '.html')

    await fs.writeFile(
        path.join(path.resolve(__dirname, '..'), lessonSavingPath, filename)
        ,
        `
        <!DOCTYPE html>
        <html>
            <head>
                <link href=\"http://127.0.0.1:9001/index.css\" rel=\"stylesheet\"></link>
            </head>
            <body>
                <p class=\"lesson-text\">${data}</p>
            </body>
        </html>
        `
    )
    return filename
}


module.exports = { generateFileName, generateHtml, lessonSavingPath }