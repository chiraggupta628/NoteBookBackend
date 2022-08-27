const mongoose = require('mongoose');


const connectToMongo =() =>{
    const uri = "mongodb+srv://chirag628:3891817Chir%40g@cluster0.obr5u9o.mongodb.net/?retryWrites=true&w=majority";
    mongoose.connect(uri
    ).then(()=>console.log('connected'))
    .catch(e=>console.log(e));;
}

module.exports = connectToMongo;