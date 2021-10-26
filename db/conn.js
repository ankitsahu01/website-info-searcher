const mongoose = require('mongoose');
const uri = process.env.DB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("DB Connection Successful.")
}).catch((err)=>{
  console.log(`DB Connection Failed. Error:${err}`)
});
