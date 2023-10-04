const Product = require('../models/product')

  exports.getAddProduct = (req, res, next) => {
      res.render('admin/edit-product', {
          pageTitle: 'Add Product',
          path: '/admin/add-product',
          editing: false,
          isAuthenticated: req.session.isLoggedIn
      });
    };
  
  exports.postAddProduct = (req, res, next) => {
    
    const { title, price, description, imageUrl } = req.body

    const product = new Product({ 
      title, 
      price, 
      description, 
      imageUrl, 
      userId: req.session.user 
    })

    product
      .save()   
      .then(result =>{
        console.log('Product Created ✅', result)

        res.redirect('/admin/products')
        
      })
      .catch(err => console.log(err))

  }

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode){
      return res.redirect('/')
    }
    const { productId } = req.params

    Product
      .findById(productId)  
      .then(product => {
        if(!product){
          return res.redirect('/')
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product,
          isAuthenticated: req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err))
    
  }

  exports.postEditProduct = (req, res, next) => {
    const { productId , title, price, imageUrl, description } = req.body

    Product
      .findById(productId)
      .then(product =>{
        product.title = title
        product.price = price
        product.imageUrl = imageUrl
        product.description = description
        return product.save()
      }).then(result => {
        console.log('PRODUCT UPDATED')
        res.redirect('/admin/products')
      })
      .catch(err => console.log(err))
  }

  exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body
    Product.findByIdAndRemove(productId)
    .then(() => {
      console.log('PRODUCT DELETED');
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
  }

  exports.getProducts = (req, res, next) => {
    Product
      .find()
      // .select('title price -_id')
      // .populate('userId', 'name')
      .then(products => {
        console.log(products)
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin products',
          path: '/admin/products',
          isAuthenticated: req.session.isLoggedIn
        })
      })
      .catch(err => console.log(err))
  }