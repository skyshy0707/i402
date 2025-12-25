'use strict';

const fs = require('fs');
const path = require('path');
const process = require('process');
const { Sequelize, DataTypes, Deferrable, Model } = require('sequelize')

const config = require('../../config')

const basename = path.basename(__filename);
const db = {};
const env = process.env.NODE_ENV || 'development';


console.log(`DB HOST: ${config.POSTGRES_DB_HOST}`)

const sequelize = new Sequelize(
   config.POSTGRES_DB, config.POSTGRES_DB_USER, null,
    {
        dialect: 'postgres',
        host: config.POSTGRES_DB_HOST
    }
)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });



class ContentType extends Model {}
ContentType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        modelName: 'ContentType'
    }
)

class Lesson extends Model {}
Lesson.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content_type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
            references: {
                model: ContentType,
                key: 'title',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        content_data: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: () => new Date().toISOString()
        },
        url: {
            type: DataTypes.VIRTUAL,
            get() {
                return `lesson/${this.id}`
            }
        }
    },
    {
        sequelize,
        modelName: 'Lesson',
        timestamps: true,
        createdAt: 'created_at'
    }
)

ContentType.hasMany(Lesson, {
    foreignKey: 'content_type', sourceKey: 'title'
})
Lesson.belongsTo(ContentType, {
    foreignKey: {
        name: 'content_type', 
    },
    targetKey: 'title'
})


db.ContentType = ContentType
db.Lesson = Lesson

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log(`Model name: ${modelName}`)
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;