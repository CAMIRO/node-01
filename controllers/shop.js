const Product = require('../models/product')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products'
    })
  })
    .catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params
  Product.findById(productId)
    .then(product=>{
      res.render('shop/product-detail', { 
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
    })
  })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items
            res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products
          })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body
  Product
    .findById(productId)
    .then(product => req.user.addToCart(product))
    .then(result => {
      console.log(result)
      res.redirect('/cart')
    })
}

exports.postCartDelete = (req, res, next) => {
  const { productId } = req.body
  req.user
    .deleteItemFromCart(productId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  let fetchedCart
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders
      })    
    })
    .catch(err => console.log(err))
}

