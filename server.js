//subido el 18/01/209
const express = require('express'); // to build api
const bodyParser = require('body-parser');//to get body from the request
const bcrypt = require('bcrypt-nodejs');//to login securetly
const cors = require('cors'); // to use header and origin-cross
const knex = require('knex'); // import lybrary

const register = require('./controllers/register');//best way to separete concern
const image = require('./controllers/image');//best way to separete concern


// const db = knex({ //make a conecction to mysql database 
//   client: 'mysql',
//   connection: {
//     host : '127.0.0.1', //localhost
//     user : 'root',
//     password : '',
//     database : 'smart-brain'
//   }
// });


// const db = knex({ //make a conecction to postresql database sing localhost
//   client: 'pg',
//   version: '7.8',
//   connection: {
//     host : '127.0.0.1',
//     user : 'root',
//     password : '',
//     database : 'smart-brain'
//   }
// });

const db = knex({ //make a conecction to postresql database sing localhost
  client: 'pg',
  version: '7.8',
  connection: {
    connectionString: process.env.DATABASE_URL, //from heroku documentation
    ssl: true
  }
});
//test of conection to db
// db.select().from('users')   //this its a promise
// 	.then( data => console.log(data)); //the response its not json


const app = express();

app.use(bodyParser.json());//we need to say to express that we are receving json data
app.use(cors()); //we need to accept origin cross request + header


app.get('/', (req, res) => {
	res.send('it is working');
} )

app.post('/signin', (req, res)=>{
	console.log("signin")
	console.log(req.body.email);
	db.select('email', 'hash')
	.from('login')
	.where('email', req.body.email)
	//work with the response from db. This response always is an array
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash) // response true or false
			if(isValid){
			return db.select().from('users')
			.where('email', req.body.email) //remember, this always return an array
			.then( user => {
				console.log(user[0]);
				res.json(user[0]);
			})
			.catch( err => res.status(400).json('unable to get user') ) //this catch whether a problem getting user 
		} else {
			res.status(400).json('wrong credentials');
		}
	}) //the next catch whether a problem with the request a login table
	.catch( err => res.status(400).json('wrong credentials') );
});

app.post('/register', (req, res)=> {register.handleRegister(req, res, db, bcrypt)} ); //db and bcrypt are called dependency injection

app.get('/profile/:id', (req, res)=>{
	const { id } = req.params; //notice it's using req.params, not req.body
	let found = false;

	db('users').where('id', id)
		.then(user => {
			// console.log(user[0]);
			if(user.length){
				res.json(user[0])
			} else {
				res.json('not found');
			}
			res.json(user[0]);
		})
		.catch(err => res.status(400).json('error getting user'));


});//end get profile

app.put('/image', (req, res)=> {image.handleImage(req, res, db)} )//end put
app.post('/imageurl', (req, res)=> {image.handleApiCall(req, res)} )//end put imageurl

//for local develop I cant set up the port 
// app.listen(3000, ()=> {
// 	console.log('app is running on port 3000');
// })

//for deployment I have to set up port dynamically. 
app.listen(process.env.PORT || 3000, ()=> {
	console.log(`app is running on port ${process.env.PORT}`);
})
