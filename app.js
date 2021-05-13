const express = require('express');
const app = express();
var cors = require('cors');
const port = 3000;
const axios = require('axios').default;
app.use(cors());

var myMap = new Map();

app.get('/queryForm', (req, res) => {
    res.sendFile("./page.html", {root: __dirname});
});

app.get('/queryForm/pokemon', function (req, res) {

    let nameParam = req.query.name;
    const URL = 'https://pokeapi.co/api/v2/pokemon/';
	const prefixImage = "https://pokeres.bastionbot.org/images/pokemon/";
	if(!myMap.has(nameParam)){
		axios.get(URL+nameParam)
		.then(pokemon_response => {
			var pokemonData = pokemon_response.data;
			//pokemonData = JSON.parse(pokemonData);

			var type = pokemonData.types["0"].type.name;
			var weigth =  pokemonData.weight;
			var img = prefixImage + pokemonData.id + ".png";
			var name = pokemonData.name;
			
			var str = JSON.stringify({name: name, img: img, weigth: weigth, type: type});
			myMap.set(nameParam, {name: name, img: img, weigth: weigth, type: type});
			console.log("I am making a request to " + URL);
			res.send(str);
		}).catch(function(error){
			console.log(error);
			res.status(404).send('the pokemon does not exist');
		});
	} else {
		console.log("yep");
		res.send(myMap.get(nameParam));
	}
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

