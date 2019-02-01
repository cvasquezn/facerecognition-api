const Clarifai = require('clarifai');

const app = new Clarifai.App({//for clarifai's api
 apiKey: 'API_KEY'
});

const handleApiCall = (req, res) =>{
	app.models.predict(
          "a403429f2ddf4b49b307e318f00e528b",
          req.body.input) //the input is the url of the image
	.then(data => {
		console.log("answer from clarifai");
		console.log(res.json(data));
		res.json(data);
	})
	.catch( err=> res.status(400).json('error clarifai API') );

}

const handleImage = (req, res, db) => {
	const { id } = req.body; //notice it's using req.params, not req.body
		
	db('users')
	  .where('id', id)
	  .increment('entries', 1)
	  .then( ()  => {
	  	db.select('entries').from('users').where('id', id)
	  	.then( entries => res.json(entries[0]) )//this give array where each elementos come like this: { entries: 6 }
	  })
	  .catch(err => res.status(400).json("unable to get entries"))
}

module.exports ={

 handleImage: handleImage,
 handleApiCall: handleApiCall

}//