const express=require("express");
const session=require("express-session");
const app=express();

app.use(session({
    secret:"mySecretkey",
    resave:false,
    saveUninitialized:true
}));
app.use(express.urlencoded({extended:true}));


const data ={ name:"surya", password:"1234"};

app.get("/",(req,res)=>{
    if(req.session.body){
        res.send(`Hi ${data.name}`);
    }
    else
    {
        res.send(`<form method="POST" ><input name="name"><input name="password"><button>Login</button></form>`);
    }
})

app.post("/",(req,res)=>{
    
    if(req.body.name===data.name &&req.body.password===data.password){
        req.session.body=req.body;
        res.redirect("/");
    }
    else{
        res.send(`Invalid credentials`);
    }
});

app.listen(5000,()=>{
    console.log("server running at http://localhost:5000");
});
