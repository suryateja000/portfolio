
const router = require('express').Router();
let Student = require('../models/student.model');
let Contest = require('../models/contest.model');

router.route('/').get((req, res) => {
  Student.find()
    .then(students => res.json(students))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').get((req, res) => {
  Contest.find()
    .then(contests => res.json(contests))
    .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;
