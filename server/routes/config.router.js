const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/fetch', (req, res) => {
  if (req.isAuthenticated()) {
    let queryText = `SELECT * FROM "config"`;
    pool.query(queryText)
      .then(response => {
        res.send(response.rows[0]);
      })
      .catch(error => {
        console.log('Error on GET: ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  }
});

router.post('/bridge', (req, res) => {
  if (req.isAuthenticated()) {
    let queryText = `INSERT INTO "config" ("id", "bridge_address")
                     VALUES (1, $1)
                     ON CONFLICT ("id")
                     DO UPDATE SET "bridge_address" = $1`;
    pool.query(queryText, [req.body.bridge_address])
      .then(response => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.log('Error saving bridge_address: ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  }
});

router.post('/token', (req, res) => {
  if (req.isAuthenticated()) {
    let queryText = `UPDATE "users" SET "token" = $1
                     WHERE "username" = $2`;
    pool.query(queryText, [req.body.token, req.user.username])
      .then(response => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.log('Error saving user token: ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  }
});

// ONLY USE THIS TO POST LIGHTS FROM HUE BRIDGE  ->> MAKE A NEW PUT ROUTE FOR LIGHT UPDATES!!!
router.post('/lights', (req, res) => {
  if (req.isAuthenticated()) {
    const lights = req.body.lights;
    let queryText = `INSERT INTO "lights" ("id", "type", "name", "room_id")
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT ("id")
                     DO UPDATE SET "type" = $2, "name" = $3, "room_id" = COALESCE($4, "lights"."room_id")`;
    lights.forEach(light => {
      pool.query(queryText, [light.id, light.type, light.name, light.room_id])
        .then(response => {
          console.log('Added light to database: ', light.name);
        })
        .catch(error => {
          console.log('Error with INSERT to "lights": ', error);
          res.sendStatus(500);
        })
    });
    res.sendStatus(201);
  } else {
    res.sendStatus(403);
  }
});

router.get('/lights', (req, res) => {
  if (req.isAuthenticated()) {
    let queryText = `SELECT * FROM "lights"
                     ORDER BY "name"`;
    pool.query(queryText)
      .then(response => {
        res.send(response.rows);
      })
      .catch(error => {
        console.log('Error with SELECT from lights: ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  }
});

router.get('/rooms', (req, res) => {
  if(req.isAuthenticated()) {
    let queryText = `SELECT * FROM "rooms"
                     ORDER BY "name"`;
    pool.query(queryText)
      .then(response => {
        res.send(response.rows);
      })
      .catch(error => {
        console.log('Error with SELECT from rooms: ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  }
});

router.post('/room', (req, res) => {
  if(req.isAuthenticated()) {
    const room = req.body.room;
    let queryText = `INSERT INTO "rooms" ("id", "name")
                     VALUES ($1, $2)
                     ON CONFLICT ("id")
                     DO UPDATE SET "name" = $2`;
    pool.query(queryText, [room.id, room.name])
      .then(response => {
        console.log('Updated room in database: ', room.name);
        res.sendStatus(201);
      })
      .catch(error => {
        console.log('Error with UPDATE to "rooms": ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  }
});

router.get('/groups', (req, res) => {
  if(req.isAuthenticated()) {
    let queryText = `SELECT "lights"."id", "lights"."name", "lights"."type", "lights"."room_id", "rooms"."name" AS "room_name", "rooms"."image" AS "room_image"
                     FROM "lights"
                     INNER JOIN "rooms" ON "lights"."room_id" = "rooms"."id"
                     ORDER BY "rooms"."id"`;
    pool.query(queryText)
      .then(response => {
        res.send(response.rows);
      })
      .catch(error => {
        console.log('Error with SELECT for groups: ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
