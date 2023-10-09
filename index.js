const express = require("express")
var bodyParser = require('body-parser')
var mongoose = require("mongoose")

const port = 3000

const app = express()

app.use(bodyParser())

mongoose.connect("mongodb+srv://abjushsaxena90:ankush123@cluster0.37q9k6c.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=AtlasApp").then((res)=>{
  console.log("database connected successfully")
}).catch((err)=>{
  console.log(err)
})


const productModel = mongoose.model("product",{
  "productName":String,
  "productImage":String,
  "productPrice":String,
  "productCurrency":String,
  "productCategory":String,
  "description":String
})


app.post("/addProduct",async(req,res)=>{
  try{
     let product =  req.body

     let isSave = new productModel(product)

     let isTrue = await isSave.save()

     if(isTrue)
     {
      res.status(200).json({
        mssg:"data added successfully",
        status:200,
        isTrue:isTrue
      })
     }
     
  }
  catch(err)
  {
    console.log(err)
    res.status(500).json({
      mssg:"something is wrong in same function ",
        status:500,
        isTrue:[]
    })

  }

})

app.get("/getProducts" , async(req,res)=>{
  try{
     let products = await productModel.find({})
    res.status(200).json({
      mssg:"data fetched successfully from database",
      status:200,
      products:products
    })
  }
  catch(err)
  {
    console.log(err)
    res.status(500).json({
      mssg:"something is wrong in same function ",
        status:500,
        products:[]
       
    })
  }
})



app.listen(port, (error)=>{
    if(error)
    {
        console.log("survey is not running")
    }
     console.log(`surver is running on ${port}`)
})