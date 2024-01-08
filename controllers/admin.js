const { validationResult } = require('express-validator')
const Product = require('../models/product')

  exports.getAddProduct = (req, res, next) => {
      res.render('admin/edit-product', {
          pageTitle: 'Add Product',
          path: '/admin/add-product',
          editing: false,
          hasError: false,
          errorMessage: null,
      });
    };
  
  exports.postAddProduct = (req, res, next) => {
    
    const { title, price, description, imageUrl } = req.body

    const errors = validationResult(req)

    if(!errors.isEmpty()){
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        editing: false,
        hasError: true,
        product: {
          title,
          imageUrl,
          price,
          description
        },
        errorMessage: errors.array()[0].msg
      });

    }

    const product = new Product({ 
      title, 
      price, 
      description, 
      imageUrl, 
      userId: req.user 
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
          hasError: false,
          errorMessage: null,
        });
      })
      .catch(err => console.log(err))
    
  }

  exports.postEditProduct = (req, res, next) => {
    const { productId , title, price, imageUrl, description } = req.body

    Product
      .findById(productId)
      .then(product =>{
        if(product.userId.toString() !== req.user._id.toString()){
          return res.redirect('/')
        }
        product.title = title
        product.price = price
        product.imageUrl = imageUrl
        product.description = description
        return product
              .save()
              .then(result => {
                console.log('PRODUCT UPDATED')
                res.redirect('/admin/products')
              })
      })
      .catch(err => console.log(err))
  }

  exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body
    Product.deleteOne({_id: productId, userId: req.user._id})
    .then(() => {
      console.log('PRODUCT DELETED');
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
  }

  exports.getProducts = (req, res, next) => {
    Product
      .find({userId: req.user._id})
      // .select('title price -_id')
      // .populate('userId', 'name')
      .then(products => {
        console.log(products)
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin products',
          path: '/admin/products'
        })
      })
      .catch(err => console.log(err))
  }