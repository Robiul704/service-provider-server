const express=require('express')
const cors=require('cors')
const app=express()
var jwt = require('jsonwebtoken');
const stripe = require("stripe")('sk_test_51OEpBDJ0V1aOTUjjqqAj9qaXLqJOOQsFXBw0mw4cKUmGyZ6JOsnkwGO943VKday3G78MN8wLCbl6pVou5CyoPKUP00edgpfKlC');
const port=process.env.PORT || 5000

//midlewere
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://robisobi:robisobi704@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   const CustommakerRequestcollection=client.db('ASSET').collection('CustommakerRequ')
   const AllRequestcollection=client.db('ASSET').collection('AllRequest')
   const Employeecollection=client.db('ASSET').collection('Employee')
   const assetcollection=client.db('ASSET').collection('Asset')
   const Teamcollection=client.db('ASSET').collection('Team')
   const Companycollection=client.db('ASSET').collection('Company')
   const Pacagecollection=client.db('ASSET').collection('Pacage')
   const Paymentcollection=client.db('ASSET').collection('Payment')
    // await client.connect();


 //---------------------------------------------------------------
//                     miadlewere varyfytoken
//---------------------------------------------------------------
const varyfyToken=(req,res,next)=>{
  if(!req.headers.token){
    return res.status(401).send({message:'forbidden access'})
  }
  const token=req.headers.token
 
  jwt.verify(token,'b7d5511f3410f8b09b7f1a7533820537f98680df59cf56cbfe2c9e743651bf04ce290b0f0ab9b8ccbfc313daec13f0fb402da3266c453a58f55d0de7d356f675', function(err, decoded) {
    if(err){
      return res.status(401).send({message:'forbidden access'})
    }
    req.decoded=decoded
    console.log(47,decoded)
    next()
  });
}
//-------------------------------------------------------------
//                varyfyAdmin
//-------------------------------------------------------------
const VaryfyAdmin=async(req,res,next)=>{
const email=req.decoded.email

const query={email:email}
const user=await Employeecollection.findOne(query)
console.log(user)
const isAdmin= user?.role==='admin'
if(!isAdmin){
res.status(403).send({message:'unauthorize'})
}
console.log(63,isAdmin)
next()
}



//--------------------------------------------------------
//             JWT RELARTED API
//--------------------------------------------------
app.post('/jwt', async(req,res)=>{
const data=req.body

const token =jwt.sign(data,'b7d5511f3410f8b09b7f1a7533820537f98680df59cf56cbfe2c9e743651bf04ce290b0f0ab9b8ccbfc313daec13f0fb402da3266c453a58f55d0de7d356f675',{
expiresIn:'1h'
})
res.send({token})
})

//------------------------------------------------------
//                     admin find
//------------------------------------------------------
app.get('/Employee/admin/:email',varyfyToken,VaryfyAdmin,async(req,res)=>{
const email=req.params.email
if(email !== req.decoded.email){
return res.status(401).send({message:'forbidden access 2'})
}
const query={email:email}
const user=await Employeecollection.findOne(query)
let admin=false
if(user){
admin=user?.role==='admin'
}
res.send({admin})
})

//----------------------------------------------------------------
//                       makerequest
//----------------------------------------------------------------
    app.post('/makerequest',async(req,res)=>{
        const data=req.body
        const result=await CustommakerRequestcollection.insertOne(data)
        res.send(result)
    })
    app.get('/makerequest',async(req,res)=>{
        const email=req.query.email
        console.log(email)
        const filter={email:email}
        const result=await CustommakerRequestcollection.find(filter).toArray()
        res.send(result)
    })
app.get('/makerequests',async(req,res)=>{
    const result =await CustommakerRequestcollection.find().toArray()
    res.send(result)
})

app.delete('/makerequests/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id: new ObjectId(id)}
  const result=await CustommakerRequestcollection.deleteOne(filter)
  res.send(result)
  })
  app.patch('/makerequests/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const updatedoc={
      $set:{
        Status:'Approved'
      }
      
    }
    const result=await CustommakerRequestcollection.updateOne(filter,updatedoc)
      res.send(result)
  })
//--------------------------------------------------------------------------
//                     employe user
//---------------------------------------------------------------------------
app.post('/Employee',async(req,res)=>{
  const data=req.body
  const email=req.query.email
  const filter={email:email}
  const find=await Employeecollection.findOne(filter)
  if(find){
    return {message:'error login',insertedId:null}
  }
    const result=await Employeecollection.insertOne(data)
    res.send(result)
})

app.get('/Employee',async(req,res)=>{
  const result =await Employeecollection.find().toArray()
  res.send(result)
})
app.patch('/Employee/:email',async(req,res)=>{
  const data=req.body
  const email=req.params.email
  const filter={email:email}
  const UpdateDoc={
    $set:{
      displayName:data.name,
      email:data.email,
      photoURL:data.photoURL,
      dateOfBirth:data.dateOfBirth
    }
  }
  const result=await Employeecollection.updateOne(filter,UpdateDoc)
  res.send(result)
})
app.get('/Employee/:email',async(req,res)=>{
  const email=req.params.email
  const filter={email:email}
  const result=await Employeecollection.findOne(filter)
  res.send(result)
})

//--------------------------------------------------------------------------
//                         asset
//---------------------------------------------------------------------------
app.post('/Asset',async(req,res)=>{
  const data=req.body
    const result=await assetcollection.insertOne(data)
    res.send(result)
})

app.get('/Asset',async(req,res)=>{
  const result =await assetcollection.find().toArray()
  res.send(result)
})
app.delete('/Asset/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id: new ObjectId(id)}
  const result=await assetcollection.deleteOne(filter)
  res.send(result)
  })
//-----------------------------------------------------------------------
app.post('/allRequest',async(req,res)=>{
  const data=req.body
    const result=await AllRequestcollection.insertOne(data)
    res.send(result)
})

   app.get('/allRequest',async(req,res)=>{
      const email=req.query.email
      const query={email:email }
      const result=await AllRequestcollection.find(query).toArray()
      res.send(result) 
  })
   app.get('/allRequests',async(req,res)=>{
      const result=await AllRequestcollection.find().toArray()
      res.send(result) 
  })
app.delete('/allRequest/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id: new ObjectId(id)}
  const result=await AllRequestcollection.deleteOne(filter)
  res.send(result)
  })
app.patch('/allRequest/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id:new ObjectId(id)}
  const updatedoc={
    $set:{
      Status:'Approved',
      AppruvalDate:new Date()
    }
    
  }
  const result=await AllRequestcollection.updateOne(filter,updatedoc)
    res.send(result)
})
//----------------------------------------------------------
app.post('/team',async(req,res)=>{
  const data=req.body
    const result=await Teamcollection.insertOne(data)
    res.send(result)
})
app.get('/team',async(req,res)=>{
  const result =await Teamcollection.find().toArray()
  res.send(result)
})
app.delete('/team/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id: new ObjectId(id)}
  const result=await Teamcollection.deleteOne(filter)
  res.send(result)
  })
//---------------------------------------------------------------------------
app.post('/company',async(req,res)=>{
  const data=req.body
    const result=await Companycollection.insertOne(data)
    res.send(result)
})
app.get('/company',async(req,res)=>{
  const result =await Companycollection.find().toArray()
  res.send(result)
})
//-------------------------------------------------
app.get('/pacage',async(req,res)=>{
  const result =await Pacagecollection.find().toArray()
  res.send(result)
})
//-----------------------------------------------------
app.post('/payments',async(req,res)=>{
  const payment=req.body
  const result=await Paymentcollection.insertOne(payment)
  const query={_id:{
    $in:payment.cartid.map(id=>new ObjectId(id))
  }}
  const deletepayment=await Paymentcollection.deleteMany(query)
  res.send({result,deletepayment})
})
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount=parseInt(price* 100)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
  });
  
  res.send({clientSecret: paymentIntent.client_secret});
});


//--------------------------------------------------------------------
//                          finishde
//--------------------------------------------------------------------

  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
