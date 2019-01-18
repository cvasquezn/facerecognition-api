//subido el 18/01/209
const express = require('express');
const bodyParser = require('body-parser');//to get body from the request
const bcrypt = require('bcrypt-nodejs');//to login securetly
const cors = require('cors');


const app = express();

app.use(bodyParser.json());//we need to say to express that we are receving json data
app.use(cors());

const database = {
	user: [
		{
			id: '123',
			name: 'chris',
			email: 'chris',
			password: 'cook',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'sally',
			email: 'sally',
			password: 'cook',
			entries: 4,
			joined: new Date()
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.user);
} )

app.post('/signin', (req, res)=>{
	console.log(req.body);
	if(req.body.email === database.user[1].email && req.body.password === database.user[1].password){
		res.json(database.user[1]);
	} else {
		res.send('error login in')
	}
});

app.post('/register', (req, res)=>{
	const {email, name, password} = req.body; //using destructuring

	bcrypt.hash(password, null, null, function(err, hash){
		console.log(hash);
	});

	database.user.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.user[database.user.length-1]);

});

app.get('/profile/:id', (req, res)=>{
	const { id } = req.params; //notice it's using req.params, not req.body
	let found = false;
	database.user.forEach(user =>{
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	});
	if(!found){
		res.status(400).json('not found');
	}


});//end get profile

app.put('/image', (req, res)=>{
	const { id } = req.body; //notice it's using req.params, not req.body
	let found = false;
	database.user.forEach(user =>{
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if(!found){
		res.status(400).json('user not found to add entries');
	}
})


app.listen(3000, ()=> {
	console.log('app is running on port 3000');
})