var express = require('express');
var router = express.Router();

/* GET success page. */
router.get('/', function(req, res, next) {
    res.render('confirmSurvey', { title: 'Express' });
});

module.exports = router;
