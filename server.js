const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger}= require('./middleware/logEvents');
const errorHandler= require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;


app.use(logger);

//cross origin resource sharing
const whitelist = ['https://www.google.com','http://127.0.0.1:5000','http://localhost:3500']
const corsOptions ={ 
    origin: (origin,callback) =>{
        if(whitelist.indexOf(origin) != -1 ||!origin) {
            callback(null,true)
        }else{
            callback(new Error('Not allowed by cors'));
        }
    },
    optionsSuccessStatus : 200
}
app.use(cors(corsOptions));


app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(express.static(path.join(__dirname,'/public')));

app.use('/subdir',require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));

// function one(req, res, next) {
//     console.log("one");
//     next();
// }

// const two=(req,res,next) =>{
//     console.log("two");
//     next();
// }

// const three=(req,res) =>{
//     console.log("three");
//     res.send("Finished");
// }

// app.get('/chain(.html)?',[one,two,three]);



//Route handlers
// app.get('/hello(.html)? ', (req,res,next) => {
//     console.log("Attempted to load hello.html");
//     next()
// },(req, res) =>{
//     res.send("Hello World");
// } )

app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));