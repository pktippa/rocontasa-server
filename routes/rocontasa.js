// Author : pktippa@gmail.com
var express = require('express');
var db = require('../services/db');
// console.log(dbconfig.conf.port);
var router = express.Router();
router.route('/upload').post(function(req, res) {
	db.insert(req, res);
});

router.route('/getpotholes').get(function(req, res) {
	db.getpotholes(req, res);
});

router.route('/getallpotholes').get(function(req, res) {
	db.getallpotholes(req, res);
});

router.route('/getclusters').get(function(req, res) {
	db.getclusters(req, res);
});

router.route('/calcpotholes').get(function(req, res) {
	db.calcpotholes(req, res);
});

router.route('/getrashdriving').get(function(req, res) {
	db.getrashdriving(req, res);
});

router.route('/saveclusters').post(function(req, res) {
	db.saveclusters(req, res);
});
module.exports = router;
