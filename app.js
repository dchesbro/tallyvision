var createError    = require('http-errors');   // Create HTTP error objects
var express        = require('express');       // Application framework
var path           = require('path');          // File and directory path utilities
var cookieParser   = require('cookie-parser'); // HTTP cookie parser
var logger         = require('morgan');        // HTTP request logger
var mongoose       = require('mongoose');      // MongoDB object modeling

// Define Express instance.
var app            = express();

// Define routers.
var adminRouter    = require('./routes/admin');
var usersRouter    = require('./routes/users');

// Define database models.
var voteModel      = require('./models/vote');

// Define Socket.IO server.
var server         = require('http').Server(app);
var io             = require('socket.io')(server);

// Define array of categories.
var categories = [
	{
		title:  'Category 1',
		label0: 'Worst',
		label5: 'Best'
	},
	{
		title:  'Category 2',
		label0: 'Worst',
		label5: 'Best'
	},
	{
		title:  'Category 3',
		label0: 'Worst',
		label5: 'Best'
	},
	{
		title:  'Category 4',
		label0: 'Worst',
		label5: 'Best'
	},
	{
		title:  'Graham Norton Bitch Quota',
		label0: 'Worst',
		label5: 'Best'
	}
];

// Define array of contestants.
var contestants = [
	{
		country: 'Albania',
		code:    'al',
		artist:  'Jonida Maliqi',
		title:   'Ktheju tokës'
	},
	{
		country: 'Armenia',
		code:    'am',
		artist:  'Srbuk',
		title:   'Walking Out'
	},
	{
		country: 'Australia',
		code:    'au',
		artist:  'Kate Miller-Heidke',
		title:   'Zero Gravity'
	},
	{
		country: 'Austria',
		code:    'at',
		artist:  'Paenda',
		title:   'Limits'
	},
	{
		country: 'Azerbaijan',
		code:    'az',
		artist:  'Chingiz',
		title:   'Truth'
	},
	{
		country: 'Belarus',
		code:    'by',
		artist:  'Zena',
		title:   'Like It'
	},
	{
		country: 'Belgium',
		code:    'be',
		artist:  'Eliot',
		title:   'Wake Up'
	},
	{
		country: 'Croatia',
		code:    'hr',
		artist:  'Roko',
		title:   'The Dream'
	},
	{
		country: 'Cyprus',
		code:    'cy',
		artist:  'Tamta',
		title:   'Replay'
	},
	{
		country: 'Czech Republic',
		code:    'cz',
		artist:  'Lake Malawi',
		title:   'Friend of a Friend'
	},
	{
		country: 'Denmark',
		code:    'dk',
		artist:  'Leonora',
		title:   'Love Is Forever'
	},
	{
		country: 'Estonia',
		code:    'ee',
		artist:  'Victor Crone',
		title:   'Storm'
	},
	{
		country: 'Finland',
		code:    'fi',
		artist:  'Darude feat. Sebastian Rejman',
		title:   'Look Away'
	},
	{
		country: 'France',
		code:    'fr',
		artist:  'Bilal Hassani',
		title:   'Roi'
	},
	{
		country: 'Georgia',
		code:    'ge',
		artist:  'Oto Nemsadze',
		title:   'Sul tsin iare'
	},
	{
		country: 'Germany',
		code:    'de',
		artist:  'S!sters',
		title:   'Sister'
	},
	{
		country: 'Greece',
		code:    'gr',
		artist:  'Katerine Duska',
		title:   'Better Love'
	},
	{
		country: 'Hungary',
		code:    'hu',
		artist:  'Joci Pápai',
		title:   'Az én apám'
	},
	{
		country: 'Iceland',
		code:    'is',
		artist:  'Hatari',
		title:   'Hatrið mun sigra'
	},
	{
		country: 'Ireland',
		code:    'ie',
		artist:  'Sarah McTernan',
		title:   '22'
	},
	{
		country: 'Israel',
		code:    'il',
		artist:  'Kobi Marimi',
		title:   'Home'
	},
	{
		country: 'Italy',
		code:    'it',
		artist:  'Mahmood',
		title:   'Soldi'
	},
	{
		country: 'Latvia',
		code:    'lv',
		artist:  'Carousel',
		title:   'That Night'
	},
	{
		country: 'Lithuania',
		code:    'lt',
		artist:  'Jurijus',
		title:   'Run with the Lions'
	},
	{
		country: 'F.Y.R. Macedonia',
		code:    'mk',
		artist:  'Tamara Todevska',
		title:   'Proud'
	},
	{
		country: 'Malta',
		code:    'mt',
		artist:  'Michela Pace',
		title:   'Chameleon'
	},
	{
		country: 'Moldova',
		code:    'md',
		artist:  'Anna Odobescu',
		title:   'Stay'
	},
	{
		country: 'Montenegro',
		code:    'me',
		artist:  'D-moll',
		title:   'Heaven'
	},
	{
		country: 'Netherlands',
		code:    'nl',
		artist:  'Duncan Laurence',
		title:   'Arcade'
	},
	{
		country: 'Norway',
		code:    'no',
		artist:  'KEiiNO',
		title:   'Spirit in the Sky'
	},
	{
		country: 'Poland',
		code:    'pl',
		artist:  'Tulia',
		title:   'Fire of Love (Pali się)'
	},
	{
		country: 'Portugal',
		code:    'pt',
		artist:  'Conan Osíris',
		title:   'Telemóveis'
	},
	{
		country: 'Romania',
		code:    'ro',
		artist:  'Ester Peony',
		title:   'On a Sunday'
	},
	{
		country: 'Russia',
		code:    'ru',
		artist:  'Sergey Lazarev',
		title:   'Scream'
	},
	{
		country: 'San Marino',
		code:    'sm',
		artist:  'Serhat',
		title:   'Say Na Na Na'
	},
	{
		country: 'Serbia',
		code:    'rs',
		artist:  'Nevena Božović',
		title:   'Kruna'
	},
	{
		country: 'Slovenia',
		code:    'si',
		artist:  'Zala Kralj & Gašper Šantl',
		title:   'Sebi'
	},
	{
		country: 'Spain',
		code:    'es',
		artist:  'Miki',
		title:   'La venda'
	},
	{
		country: 'Sweden',
		code:    'se',
		artist:  'John Lundvik',
		title:   'Too Late For Love'
	},
	{
		country: 'Switzerland',
		code:    'ch',
		artist:  'Luca Hänni',
		title:   'She Got Me'
	},
	{
		country: 'United Kingdom',
		code:    'gb',
		artist:  'Michael Rice',
		title:   'Bigger Than Us'
	}
];

// Define app variables.
var contestant;
var userCount = 0;

// Set app variables.
app.set('categories', categories);
app.set('contestants', contestants);

// Set views.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Express app generator setup.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/', usersRouter);
app.use('/admin', adminRouter);

// Forward 404 messages to error handler.
app.use(function(req, res, next) {
	next(createError(404));
});

// HTTP error handler.
app.use(function(err, req, res, next) {
	
	// Set local development error messages.
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	res.status(err.status || 500);
	res.render('error');
});

// Define MongoDB connection.
var db = mongoose.connect('mongodb://localhost/tallyvision', {useNewUrlParser: true});

// Client Socket.IO event handlers.
io.on('connection', function(socket){
	
	/**
	 * ...
	 */
    socket.on('ballot-init', function(index){

		// If contestant set, return.
		if(contestant){
			return;
		}

        // Set contestant using contestant index number.
        contestant = contestants[index];

        // Return 'ballot-open' event (everyone).
		io.sockets.emit('ballot-open', contestant);
		
		// Print debug message(s).
        console.log('IO Opening ballot "' + contestant.country + '"');
	});
	
	/**
	 * ...
	 */
    socket.on('ballot-kill', function(){

        // If contestant not set, return.
		if(!contestant){
			return;
		}

        // Return 'ballot-close' event (everyone).
		io.sockets.emit('ballot-close');
		
		// Print debug message(s).
		console.log('IO Closing ballot "' + contestant.country + '"');
		
		// Set contestant to null.
		contestant = null;
    });

    /**
	 * ...
	 */
    socket.on('disconnect', function(){

		// If socket not registered, return.
		if(!socket.registered){
			return;
		}

		// Decrease registered user count.
		userCount--;

		// Return 'user-disconected' event (everyone).
        io.sockets.emit('client-disconnected', { username: socket.username, userCount });
		
		// Print debug message(s).
		console.log('IO Registered user "' + socket.username + '" disconnected');
		console.log('IO ' + userCount + ' user(s) registered');
    });

    /**
	 * ...
	 */
    socket.on('user-register', function(username){
        
        // If socket registered, return.
        if(socket.registered){
			return;
		}

        // Set socket username and registered property.
		socket.username = username;
		socket.registered = true;

		// Increase registered user count.
		userCount++;
		
		// Return 'user-registered' event (sender).
		socket.emit('user-registered');

		// Return 'client-connected' event (everyone).
        io.sockets.emit('client-connected', { username: socket.username, userCount });
		
		// Print debug message(s).
        console.log('IO Registered socket ID ' + socket.id + ' as user "' + socket.username + '"');
		console.log('IO ' + userCount + ' user(s) registered');
		
		// ...
		if(contestant){
			
			// Return 'ballot-open' event (sender).
			socket.emit('ballot-open', contestant);
		
			// Print debug message(s).
        	console.log('IO Opening ballot "' + contestant.country + '" for user "' + socket.username + '"');
		}
	});
	
	/**
	 * ...
	 */
	socket.on('user-vote', function({ scores }){
		
		// If socket not registered or contestant not set, return.
		if(!socket.registered || !contestant){
			return;
		}

		// Print debug message(s).
		console.log('IO Registered user "' + socket.username + '" submitted scores for "' + contestant.country + '"');

		// Parse scores as integers and define vote object.
		var vote = new voteModel({
			user: socket.username,
			contestant: contestant.code,
			cat1: parseInt(scores.cat1),
			cat2: parseInt(scores.cat2),
			cat3: parseInt(scores.cat3),
			cat4: parseInt(scores.cat4),
			cat5: parseInt(scores.cat5)
		});

		// Save vote to database.
		vote.save(function(err, vote){
			if(err){
				console.log(err.message);
			}
		});

		// Return 'user-voted' event (sender).
		socket.emit('user-voted');

		// Return 'client-voted' event (everyone).
		io.sockets.emit('client-voted');

		// Print debug message(s).
		console.log('DB Saved vote ID ' + vote._id);
	});
});

module.exports = { app: app, server: server };
