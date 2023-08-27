const fs = require('node:fs')
const path = require('node:path')

// Global constant
const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
)

// Helper function
const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if(err){
           return cb([])
        }
        cb(JSON.parse(fileContent))
    })

}

module.exports = class Product {
    constructor(t){
        this.title = t
    }

    save() {
        getProductsFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            })
        })
    }

    static fetchAll(cb){
        getProductsFromFile(cb)
    }
}


