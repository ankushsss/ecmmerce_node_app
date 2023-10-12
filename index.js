const express = require("express")
var bodyParser = require('body-parser')
var mongoose = require("mongoose")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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


const userModel = mongoose.model("user",{
  "fullName":String,
  "mobileNumber":String,
  "gendar":String,
  "email":String,
  "username":String,
  "password":String
})

const isLogin = async (req,res,next)=>{
  jwt.verify(req.query.token, '21238811166762aa', function(err, decoded) {
    console.log(decoded) // bar
    if(decoded)
    {
      next()
    }
    else{
      res.status(400).json({
        mssg:"unauthorized token",
        status:400
      })
    }
  });
} 

app.post("/addUser",isLogin,async(req,res)=>{
  try{
    let user = req.body
    bcrypt.hash(req.body.password, 10, async function(err, hash) {
      
      console.log(hash)
      let isSave = new userModel({
        "fullName":req.body.fullName,
        "mobileNumber":req.body.mobileNumber,
        "gendar":req.body.gendar,
        "email":req.body.email,
        "username":req.body.username,
        "password":hash
      })
      let isTrue = await isSave.save()
      if(isTrue)
      {
       res.status(200).json({
         mssg:"data added successfully",
         status:200,
         isTrue:isTrue
       })
      }
  });
  
    
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


app.post("/login",async(req,res)=>{
  try{
    let {email,password} = req.body  //destructure
    
    let user = await userModel.find({email:email})  //  req.body.email

    console.log(user)
     
    if(user.length == 0)
    {
      res.status(400).json({
        mssg:"user not found",
          status:400,
          user:user
      })
    }
    else
    {
      bcrypt.compare(password, user[0].password, function(err, result) {
        // result == true
          if(result == true)
          {
            var token = jwt.sign({...user[0]}, '21238811166762aa');
            res.status(200).json({
              mssg:"user loggedin success",
                status:200,
                user:user,
                token
            })
          }
          else
          {
            res.status(400).json({
              mssg:"user not found",
                status:400,
            })
          }
    });
    }


  }
  catch(err)
  {
    res.status(500).json({
      mssg:"something is wrong in same function ",
        status:500,
        isTrue:[]
    })
  }
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



app.get("/getProducts" ,isLogin, async(req,res)=>{
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

app.get("/getUser" ,isLogin, async(req,res)=>{
  try{
     let users = await userModel.find({})
    res.status(200).json({
      mssg:"data fetched successfully from database",
      status:200,
      users:users
    })
  }
  catch(err)
  {
    console.log(err)
    res.status(500).json({
      mssg:"something is wrong in same function ",
        status:500,
        users:[]
       
    })
  }
})

app.delete("/productDelete/:id",isLogin,async(req,res)=>{
     try{
         let {id} = req.params
         let deleteUser = await productModel.findByIdAndDelete(id)
         if(deleteProduct)
         {
          res.status(200).json({
            status:200,
            mssg:"delete successfully",
            deleteProduct

          })
         }
     }
     catch(err)
     {
      console.log(err)
      res.status(500).json({
        status:500,
        mssg:"delete successfully",
        err

      })
     }
})
app.delete("/userDelete/:id",isLogin,async(req,res)=>{
  try{
      let {id} = req.params
      let deleteUser = await userModel.findByIdAndDelete(id)
      if(deleteUser)
      {
       res.status(200).json({
         status:200,
         mssg:"delete successfully",
         deleteUser

       })
      }
  }
  catch(err)
  {
   console.log(err)
   res.status(500).json({
     status:500,
     mssg:"delete successfully",
     err

   })
  }
})

app.put("/updateProduct/:id",isLogin,async(req,res)=>{
  try{
      let {id} = req.params
      let updateProduct = await productModel.findByIdAndUpdate(id,req.body)
      if(updateProduct)
      {
       res.status(200).json({
         status:200,
         mssg:"product update successfully",
         updateProduct

       })
      }
  }
  catch(err)
  {
   console.log(err)
   res.status(500).json({
     status:500,
     mssg:"domething is wrong in current function",
     err

   })
  }
})

app.put("/updateUser/:id",isLogin,async(req,res)=>{
  try{
      let {id} = req.params
      let userUpdate = await userModel.findByIdAndUpdate(id,req.body)
      if(userUpdate)
      {
       res.status(200).json({
         status:200,
         mssg:"user update successfully",
         userUpdate

       })
      }
  }
  catch(err)
  {
   console.log(err)
   res.status(500).json({
     status:500,
     mssg:"domething is wrong in current function",
     err

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

//mvc architecture