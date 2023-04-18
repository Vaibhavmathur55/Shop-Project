const Product = require('../models/product');
const mongoose = require('mongoose')
const schema = mongoose.Schema

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pgTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description} = req.body;
  //Keys defined in productSchema while values as obtained from data received in controller action
 const product = new Product({title: title, imageUrl: imageUrl, price: price, description: description, userId: req.user})
 product.save()
 .then(result => {
  console.log('created Product')
  res.redirect('/admin/adminproduct-list')
 })
 .catch((err => console.log(err)))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if(!editMode){
    return res.redirect('/')
  }
  const prodId = req.params.productID
   Product.findById(prodId)
  .then(prod => {
    if(!prod){
      return res.redirect('/')
    }
    res.render('admin/edit-product', { 
    pgTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: prod,
    isAuthenticated: req.session.isLoggedIn
  })
  })
  .catch((err => console.log(err)))
};

exports.postEditProduct = (req, res, next) => {
  const updatedproductID = req.body.productID
  const updatedTitle = req.body.title 
  const updatedImageUrl = req.body.imageUrl
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  //Find product we want to edit in database through id and save product
  Product.findById(updatedproductID).then(product => {
    product.title = updatedTitle,
    product.imageUrl = updatedImageUrl,
    product.price = updatedPrice,
    product.description = updatedDescription
    return product.save()
  })
  res.redirect('/admin/adminproduct-list')
  .catch(err => console.log(err))
}

exports.getAdminProduct = (req, res, next) => {
   Product.find()
  .then(addedProduct=> {
    res.render('admin/adminproduct-list', {
      result: addedProduct,
      pgTitle: 'Admin Products',
      path: '/admin/adminproduct-list',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
};
  
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productID
//Both findByIdAndRemove() and findByIdAndDelete() does same thing, but former returns the document while other doesn't
Product.findByIdAndRemove(prodId)
.then(() => {
  res.redirect('/admin/adminproduct-list');
})
.catch(err => {
  console.log(err);
});  
}
