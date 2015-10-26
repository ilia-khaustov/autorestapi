var argv = require('yargs').argv,
    express = require('express'),
    router = express.Router(),
    http = require('http'),
    https = require('https'),
    bodyParser = require('body-parser'),
    logger = require('express-logger')({path: argv.log_file}),
    multer = require('multer'),
    upload = multer(),
    fs = require('fs');

var options = {
  key: fs.readFileSync(argv.ssl_key),
  cert: fs.readFileSync(argv.ssl_cert)
};

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

var models = {};


router.get('/', function (req, res) {
  res.json(models);
});

router.get('/:model', function (req, res) {
  if (!models[req.params.model]) {
    return res.sendStatus(404);
  }
  res.json(models[req.params.model]);
});

router.post('/:model', function (req, res) {
  var newModel = req.body;
  if (models[req.params.model]) {
    return res.sendStatus(403);
  }
  models[req.params.model] = newModel;
  res.json(newModel);
});

router.put('/:model', function (req, res) {
  var updatedModel = req.body,
      existingModel = models[req.params.model];
  if (!existingModel) {
    return res.sendStatus(404);
  }
  for (var key in updatedModel) {
    existingModel[key] = updatedModel[key];
  }
  res.json(existingModel);
});

router['delete']('/:model', function (req, res) {
  var deletedModel = models[req.params.model];
  if (!deletedModel) {
    return res.sendStatus(404);
  }
  delete models[req.params.model];
  res.json(deletedModel);
});

var app = express();
app.use(allowCrossDomain);
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

http.createServer(app).listen(argv.http_port || 80);
https.createServer(options, app).listen(argv.https_port || 443);