const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
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
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
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
        path: '/',
        isAuthenticated: req.session.isLoggedIn
    })
  })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items
            res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products,
              isAuthenticated: req.session.isLoggedIn
          })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
  const { productId } = req.body
  Product
    .findById(productId)
    .then(product => req.session.user.addToCart(product))
    .then(result => {
      console.log(result)
      res.redirect('/cart')
    })
}

exports.postCartDelete = (req, res, next) => {
  const { productId } = req.body
  req.session.user
    .removeFromCart(productId)
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  console.log(req.session.user);
  req.session.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }
      })
      const order = new Order({
        user: {
          name: req.session.user.name,
          userId: req.session.user
        },
        products
      })
      return order.save()
    })
    .then(() => req.session.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  Order
    .find({'user.userId': req.session.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        isAuthenticated: req.session.isLoggedIn
      })
    })    
    .catch(err => console.log(err))
}

