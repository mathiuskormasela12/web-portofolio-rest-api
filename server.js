// ========== Server
// import all modules
const express			= require('express');
const dotenv			= require('dotenv');
const cors				= require('cors');

// setup dotenv
dotenv.config({ path: './.env' });

// init app & port
const app					= express();
const port				= process.env.PORT || 3000;

// setup url encoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// setup static files
app.use(express.static('./public'));

// define client url
const whiteList		= [
	'http://127.0.0.1:8080',
	'http://localhost:8080',
	'http://192.168.1.30:8080',
	'http://192.168.1.31:8080',
	'http://192.168.1.32:8080'
];

// init cors option
const corsOptions	= {
	origin: function(origin, callback) {
		if(whiteList.indexOf(origin) != -1 || !origin) 
			callback(null, true);
		else
		 callback(new Error('Blocked By Cors'));
	}
}

// setup cors
app.use(cors(corsOptions));

// define routes
app.use('/api', require('./app/routes/pages'));

app.listen(port, () => console.log(`Web Service running at http://127.0.0.1:${port}/api`));
