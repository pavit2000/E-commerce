const asyncHandler = require('express-async-handler')
const Users = require('../models/userModel')
// const Carts = require('../models/cartModel')
const { Cart } = require("../models/cartModel");
const Products = require('../models/productModel')
const Orders = require('../models/orderModel')
const uniqid = require('uniqid')
const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeKey ? require('stripe')(stripeKey) : null

createOrder = asyncHandler(async(req,res)=>{
    // const COD = req.body
    const { address, email, contact, cartTotal } = req.body
    const userId = req.user._id
    // if (!COD) throw new Error('Cash Order is Mandatory')
    const user = await Users.findById(userId)
    // const userCart = await Carts.findOne({orderby: user._id})
    const userCart = await Cart.findOne({userId: user._id})
    // console.log(cartTotal);
    const orderProducts = userCart.products.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        title: item.title,
        price: item.price,
        count: item.count,
        color: item.color
    }))
    const finalAmount = cartTotal
    const newOrder = await new Orders({
        // products: userCart.products,
        products: orderProducts,
        totalPrice: finalAmount,
        paymentIntent: {
            id: uniqid(),
            method: 'COD',
            amount: finalAmount,
            status: 'Cash on Delivery',
            created: Date.now(),
            currency: 'USD'
        },
        orderby: user._id,
        email: email,
        address: address,
        contact: contact,
        orderStatus: 'Cash on Delivery'
    }).save()
    // console.log(newOrder);
    // let update = userCart.products.map((item)=>{
    //     return {
    //         updateOne: {
    //             filter: { _id: item.productId._id},
    //             update: {$inc: {quantity: -item.quantity, sold: +item.quantity}}
    //         }
    //     }
    // })
    // let updated = await Products.bulkWrite(update, {})
    // console.log(updated);
    res.json({message: 'Success'})
})

getOrders = asyncHandler(async(req,res)=>{
    userId = req.user._id
    const userOrders = await Orders.find()
    res.json(userOrders)
})

getOrder = asyncHandler(async(req,res)=>{
    const userOrder = await Orders.findById(req.params.id)
    res.json(userOrder)
})

getUserOrders = asyncHandler(async (req, res) => {
    const userId= req.user._id
    // console.log(userId)
    const userOrders = await Orders.find({ orderby: userId })
        .populate("products.productId")
        // .populate("orderby")
        .exec()
    // if(userOrders.length) res.json([userOrders])
    // else res.json({msg: 'No Orders Found'})
    res.json(userOrders)
})

deleteOrder = asyncHandler(async(req,res)=>{
    const orderId = req.params.id
    const userOrderAvailable = await Orders.findOne({"paymentIntent.id": orderId})
    // console.log(userOrderAvailable);
    await Orders.findOneAndDelete({"paymentIntent.id": orderId})
    res.json({msg: 'successfully deleted', userOrderAvailable})
})

createPaymentIntent = asyncHandler(async(req,res)=>{
    const order = await Orders.findById(req.params.id)
    if(!order){
        res.status(404)
        throw new Error('Order not found')
    }

    let paymentIntent
    if(!stripe){
        res.status(500)
        throw new Error('Stripe not configured Set STRIPE_SECRET_KEY in server/.env')
        // order.paymentIntent = {
        //     id: uniqid(),
        //     method: 'Simulated',
        //     amount: order.totalPrice,
        //     status: 'Paid',
        //     created: Date.now(),
        //     currency: 'USD'
    } else {
        try {
            paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(order.totalPrice * 100),
                currency: 'usd',
                metadata: {orderId: order._id.toString()}
            })
        } catch (err) {
            console.error('Stripe error:', err)
            res.status(500)
            throw new Error(err.message)
        }

        order.paymentIntent = {
            id: paymentIntent.id,
            method: 'Card',
            amount: order.totalPrice,
            status: 'Paid',
            created: Date.now(),
            currency: paymentIntent.currency
        }
    }

    //order.orderStatus = 'Processing'
    await order.save()
    if (paymentIntent) {
        res.json({clientSecret: paymentIntent.client_secret})
    }
    //res.json({clientSecret: paymentIntent.client_secret})
    //res.json(order)
})

confirmPayment = asyncHandler(async(req,res)=>{
    const order = await Orders.findById(req.params.id)
    if(!order){
        res.status(404)
        throw new Error('Order not found')
    }

    if(!stripe){
        res.status(500)
        throw new Error('Stripe not configured')
    }

    const { paymentIntentId } = req.body
    //const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    let paymentIntent
    try {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    } catch (err) {
        console.error('Stripe error:', err)
        res.status(500)
        throw new Error(err.message)
    }

    if(paymentIntent.status === 'succeeded'){
        order.paymentIntent.status = 'Paid'
        order.paymentIntent.id = paymentIntent.id
        order.orderStatus = 'Processing'
        await order.save()
        res.json(order)
    }else{
        res.status(400)
        throw new Error('Payment not completed')
    }
})


updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body
    const updateOrderStatus = await Orders.findByIdAndUpdate(
        req.params.id,
        {
          orderStatus: status,
          paymentIntent: {status: status}
        },
        { new: true }
      )
      res.json(updateOrderStatus);
    
})
module.exports = { createOrder, getOrders, getOrder, getUserOrders, deleteOrder, updateOrderStatus, createPaymentIntent, confirmPayment }