/* index.js */

const CONFIG = require("./conf");
const pug = require("pug");
const models = require("./models/index");
const users = require("./routers/users");

function installBodyParsers(server) {
  var bodyParser = require("body-parser");
  server.use(bodyParser.json({ limit: '1mb' }));
  server.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
}

function newServer() {
  var express = require("express");
  var server = express();
  for (var mkey in CONFIG.server.mounts) {
    server.use(mkey, express.static(CONFIG.server.mounts[mkey]));
  }
  installBodyParsers(server);
  return server;
}

var pageFunction = pug.compileFile("templates/page.pug", CONFIG.pug);

function handlePage(request, response) {
  var pages = CONFIG.pages;
  var pageKey = request.params.page || CONFIG.defaultPage;
  if (!(pageKey in pages)) {
    response.sendStatus(404);
  }
  else {
    response.set("Content-Type", "text/html");
    response.send(pageFunction(pages[pageKey]));
  }
}

(function() {
  var server = newServer();

  var port = process.env.PORT || CONFIG.server.port;
  server.set("port", port);

  server.get("/", handlePage);
  server.get("/pages/:page", handlePage);
  server.use("/users", users);

  // EmailProfile CRUD
  server.post("/emailprofiles", function(req, res) {   // create
    models.EmailProfile.create({
      email: req.body.email,
      UserId: req.body.user_id
    }).then(function(asset) {
      res.json(asset);
    });
  });
  server.get("/emailprofile/:id", function(req, res) {   // retrieve (by id)
    models.EmailProfile.find({
      where: {
        id: req.params.id
      }
    }).then(function(emails) {
      res.json(emails);
    });
  });
  server.get("/emailprofile/email/:email", function(req, res) {   // retrieve (by email)
    models.EmailProfile.find({
      where: {
        email: req.params.email
      }
    }).then(function(emails) {
      res.json(emails);
    });
  });

  // Session CRUD
  server.post("/sessions", function(req, res) {   // create
    models.Session.create({
      externalId: req.body.external_id,
      UserId: req.body.user_id
    }).then(function(asset) {
      res.json(asset);
    }).catch(function(error) {
      res.json(error);
    });
  });
  server.get("/session/:external_id", function(req, res) {   // retrieve (by external id)
    models.Session.find({
      where: {
        externalId: req.params.external_id
      }
    }).then(function(sessions) {
      res.json(sessions);
    }).catch(function(error) {
      res.json(error);
    });
  });
  server.put("/session/:external_id", function(req, res) {   // update
    models.Session.find({
      where: {
        externalId: req.params.external_id
      }
    }).then(function(session) {
      if (session) {
        session.updateAttributes({});
        res.json(session);
      }
      else {
        res.json({});
      }
    }).catch(function(error) {
      res.json(error);
    });
  });
  server.delete("/session/:external_id", function(req, res) {   // delete
    models.Session.destroy({
      where: {
        externalId: req.params.external_id
      }
    }).then(function() {
      res.json({});
    }).catch(function(error) {
      res.json(error);
    });
  });

  // Asset CRUD
  server.post("/assets", function(req, res) {   // create
    models.Asset.create({
      key: req.body.key,
      size: req.body.size,
      mime: req.body.mime,
      UserId: req.body.user_id
    }).then(function(asset) {
      res.json(asset);
    });
  });
  server.get("/asset/:id", function(req, res) {   // retrieve (by id)
    models.Asset.find({
      where: {
        id: req.params.id
      }
    }).then(function(assets) {
      res.json(assets);
    });
  });

  server.listen(port, function () {
    console.log("Listening on port", port);
  });
})();