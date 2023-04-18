const Product = require('../models/product'); 
const User = require('../models/user')
const Order = require('../models/order')
const mongoose = require('mongoose')
const schema = mongoose.Schema

exports.getShop = (req, res, next) => {
//To fetch all products as array. In case we query large amounts of data, we should turn this into a cursor to limit the set of data that is retrieved
//Populate() allows tell mongoose to populate a certain field with all the detail information and not just the ID. select() defines which fields we want to select (or unselect using -), so which fields should actually be retrieved from the database
    Product.find().populate('userId')
    .then(rows => {
        res.render('shop/shopproduct-list', {
            result: rows,
            pgTitle: 'All Products', 
            path: '/products', 
            isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
    .then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pgTitle: product.title,
            path: '/products',
            isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err => console.log(err)) 
}; 


exports.getIndex = (req, res, next) => {
    Product.find()
    .then(rows => {
        res.render('shop/index', {
            result: rows,
            pgTitle: 'My Shop', 
            path: '/index', 
            isAuthenticated: req.session.isLoggedIn,
    })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
//Fetch data for path cart.items.productId, means fetching all products in a user's cart. populate() returns related data to what mentioned in ''
    req.user.populate('cart.items.productId')
        .then(user => {
        const cartProduct = user.cart.items
        //Once got products from cart, render the cart
        res.render('shop/cart', {
            pgTitle: 'My cart',
            path: '/cart',
            cartProd: cartProduct,
            isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const id = req.body.productID;
    //Fetch product we want to add here through id
    Product.findById(id)
//Use request user which now is our full user model and call add to cart, which isn't a static method in 'user' model
    .then(product => {
        return req.user.addToCart(product)
    })
    res.redirect('/cart')
  };
  
exports.getOrders = (req, res, next) => {
    //Get all previous orders
    Order.find({'user.userId': req.user._id})
    .then(orders => {
        res.render('shop/orders', {
            pgTitle: 'My Orders',
            path: '/orders',
            prevOrders: orders,
            isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err => console.log(err))
}


exports.postOrder = (req, res, next) => {
    req.user
      .populate('cart.items.productId')
      .then(user => {
        const cartProduct = user.cart.items.map(i => {
          return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        const order = new Order({
          user: {
            email: req.user.email,
            userId: req.user
          },
          products: cartProduct
        });
        return order.save();
      })
      .then(result => {
        return req.user.clearCart();
      })
      .then(() => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };

exports.postDeleteItem = (req, res, next) => {
    const id = req.body.productID;
    req.user.deleteItemFromCart(id)
    res.redirect('/cart')
}


