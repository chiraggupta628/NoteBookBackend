const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();
const app = express()
const port =  process.env.PORT || 3000 ;
app.use(cors());

app.use(express.json())

app.use('/api/v1/auth',require('./routes/auth'));
app.use('/api/v1/notes',require('./routes/notes'));
app.get("/",(req,res)=>{
  res.send("Running");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})