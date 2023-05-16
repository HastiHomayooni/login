const express = require("express");
const bodyParser=require("body-parser");
const path = require("path");
const crypto=require("crypto");

var app = express();
const port = 4444;
var users=[];

app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
//   res.send("hello");
res.send(users)
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());


app.post('/register', (req, res)=> {

	let {username,password,email}=req.body;
	if(!username || !password){
		return res.send({message : "Username and password can't be empty",});
	}
	if(users.findIndex((u)=> u.username==username) >=0){
		return res.send({message: "You have already registered",});
	}
    const secret = crypto.randomBytes(16).toString('hex');
	const key=crypto.pbkdf2Sync(password,secret,2000,16,"sha512").toString("hex");
	users.push({username :username,password:key,secret:secret,email:email});
	res.send({message: "Registration was successful",}); 

});

app.post('/login',(req,res)=>{
	let {username,password}=req.body;
	if(!username || !password){
		return res.send({message : "Username and password can't be empty",});
	}
	let index =users.findIndex((u)=> u.username==username);
	if(index<0) return res.send({message : "You have not registered before",});
	let user =users[index];
	const secret=user.secret;
	const key =crypto.pbkdf2Sync(password,secret,2000,16,"sha512").toString("hex");
	if(user.password== key){
		return res.send({message: "Login was successful"});
	}else{
		return res.send({message: "Incorrect password"});
	}
});
app.post('/delete',(req,res)=>{
	let {username,password}=req.body;
	if(!username || !password){
		return res.send({message : "Username and password can't be empty",});
	}
	let index =users.findIndex((u)=> u.username==username);
	if(index<0) {
		return res.send({message : "You have not registered before",});
	}else{
		users[index]=null;
		return res.send({message :"Your account has been deleted"});
	}
	
});
app.post('/changePassword',(req,res)=>{
	let {username,password,newP}=req.body;
	if(!username || !password || !newP){
		return res.send({message : "Username and password and new password can't be empty",});
	}
	let index =users.findIndex((u)=> u.username==username);
	if(index<0) {
		return res.send({message : "You have not registered before",});
	}
	let user =users[index];
	const secret=user.secret;
	const key =crypto.pbkdf2Sync(password,secret,2000,16,"sha512").toString("hex");
	if(user.password== key){
		const keyN=crypto.pbkdf2Sync(newP,secret,2000,16,"sha512").toString("hex");
		users[index].password=keyN;
		return res.send({message :"Changing password was success"});
	}else{
		return res.send({message: "Incorrect password"});
	}
});
app.post('/changeEmail',(req,res)=>{
	let {username,password,newE}=req.body;
	if(!username || !password || !newE){
		return res.send({message : "Username and password and new email can't be empty",});
	}
	let index =users.findIndex((u)=> u.username==username);
	if(index<0) {
		return res.send({message : "You have not registered before",});
	}
	let user =users[index];
	const secret=user.secret;
	const key =crypto.pbkdf2Sync(password,secret,2000,16,"sha512").toString("hex");
	if(user.password== key){
		users[index].email=newE;
		return res.send({message :"Changing email was success"});
	}else{
		return res.send({message: "Incorrect password"});
	}
})
// Rotuers
// const autheticateRouter = require("./router/authenticate");

// app.use("/auth/", autheticateRouter);

// Initilize app
app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});

