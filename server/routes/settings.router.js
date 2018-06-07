const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/fetch', (req, res) => {
  if(req.isAuthenticated()) {
    let queryText = `SELECT "bridge", "token" FROM "users"
                     WHERE "username" = $1`;
    pool.query(queryText, [req.user.username])
      .then(response => {
        res.send(response.rows[0]);
      })
      .catch(error => {
        console.log('Error on GET: ', error);
        res.sendStatus(500);
      })
  }
});

router.post('/save', (req, res) => {
  if(req.isAuthenticated()) {
    let queryText = `UPDATE "users" SET "token" = $1, "bridge" = $2
                     WHERE "username" = $3`;
    pool.query(queryText, [req.body.apiToken, req.body.bridgeIP, req.user.username])
      .then(response => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.log('Error on PUT: ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  } 
});

router.post('/light', (req, res) => {
  if(req.isAuthenticated()) {
    const lights = req.body;
    let queryText = `DELETE FROM "lights"`;
    pool.query(queryText)
      .then(response => {
        queryText = `INSERT INTO "lights" ("id", "type", "name")
                     VALUES ($1, $2, $3)`;
        lights.forEach(light => {
          pool.query(queryText, [light.id, light.type, light.name])
            .then(response => {
              console.log('Added light to database');
            })
            .catch(error => {
              console.log('Error with INSERT: ', error);
            })
        });
        res.sendStatus(201);
      })
      .catch(error => {
        console.log('Error with DELETE: ', error);
        res.sendStatus(500);
      })
  } else {
    res.sendStatus(403);
  }
});

router.get('/light', (req, res) => {
  if(req.isAuthenticated()) {
    let queryText = `SELECT * FROM "lights"`;
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

module.exports = router;