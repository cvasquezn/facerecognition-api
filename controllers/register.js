
const handleRegister = (req, res, db, bcrypt)=>{
	const {email, name, password} = req.body; //using destructuring
	
	if(!email || !name || !password){
		res.status(400).json('incorrect form submission');
	}

	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then( loginEmail => {
			return trx('users')
					.returning('*')
					.insert({
						email: email,
						name: name,
						joined: new Date(),
					})
					.then( response => {
						let idUser = response[0]; //recupero el id as an int
						console.log(idUser);
							db('users').where('id', idUser) //get the user with that id. This query return an array with object like this: [{}]
								.then(user => { 
									console.log(user[0]);
									res.json(user[0])  //send user as json
								})
					})
		})
		.then(trx.commit)
      	.catch(trx.rollback) //if any operation doesn't work all changes do on db are reverse
		
	})//end transaction
	.catch(err => res.status(400).json('unable to register'))

}

module.exports = {
	handleRegister: handleRegister
}
