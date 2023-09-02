const Sequelize = require('sequelize')
require('dotenv').config()

const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST } = process.env

const sequelize = new Sequelize( DB_DATABASE,  DB_USER,  DB_PASSWORD, { 
    dialect: 'mysql', 
    host: DB_HOST 
})

module.exports = sequelize