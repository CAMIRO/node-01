const fs = require('node:fs')
const path = require('node:path')

// Global constant
const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'cart.json'
)

module.exports = class Cart {

   static addProduct(id, productPrice) {
    // 1.Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
        let cart = { products: [], totalPrice: 0 }
        if(!err){
            cart = JSON.parse(fileContent)
        }
        // 2.Analyze the cart => Find existing product
        const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
        const existingProduct = cart.products[existingProductIndex]
        // 3.Add new product / increase quantity 
        let updatedProduct
        if(existingProduct){
            updatedProduct = {...existingProduct}
            updatedProduct.qty = updatedProduct.qty + 1
            cart.products = [...cart.products]
            cart.products[existingProductIndex] = updatedProduct
        } else {
            updatedProduct = { id, qty: 1 }
            cart.products = [...cart.products, updatedProduct]
        }
        cart.totalPrice = cart.totalPrice + +productPrice
        fs.writeFile(p, JSON.stringify(cart), err => console.log(err))
    })

   }
}