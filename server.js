// server.js
/**
 * Serveur de données pour l'application Answare.
 */

// Importation des paquets requis
var express     = require('express')
  , bodyParser  = require('body-parser')
  , cors        = require('cors');

// Chargement des données
var quizzes, datasIndex;

// Initialisation et configuration
var filename = "./data/quizzes";

(function() {
   quizzes = require(filename);
   datasIndex = [];

   quizzes.forEach(function (item, i) {
     datasIndex.push(item.name);
   });
})();

//dataLoad();

//1 - INITIALISATION DE L'APPLICATION
var app = express();

app.use(bodyParser.urlencoded({ extended : true }));

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/bower_components"));


// 2 - DEFINITION DES ROUTES
var router = express.Router();

router.use(function(req, res, next) {
  var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log('[' + new Date().toGMTString() + '] ' + req.method + ' ' + req.url + ' depuis ' + remoteIp);
  next();
});

router.route('/quizzes')
  .get(function(req, res) {
      res.json(quizzes);
  });

router.route('/quizzes/:name')
  .get(function(req, res) {
      seekIndex = datasIndex.indexOf(req.params.name);
      if (seekIndex > -1) {
        quiz = quizzes[seekIndex];
        res.json(quiz);
      } else {
        res.status(404).send('No documents matching with your request.');
      }
  });

// Monte les routes avec le préfixe /api
app.use('/api', router);

// 3 - LANCEMENT DU SERVEUR
var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});
