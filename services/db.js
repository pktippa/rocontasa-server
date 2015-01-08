var dbconf = require('../config/dbconfig');
var zlib = require('zlib');
var csv = require('csv');
var parse = require('csv-parse');
var fs = require('fs');
var mongo = require('mongoskin');  // mongoskin for connecting and querying mongodb


var c = dbconf.conf;

var db= getConnection();
db.setMaxListeners(0);

exports.saveclusters=function saveclusters(req, res){
	var db= getConnection();
        db.setMaxListeners(0);

	var body =req.body;
	console.log(body);

	db.collection("clusters").insert(body, function(err, result) {
                 if (err) console.log(err);
		 if(result) console.log(result);	
        });

}

exports.insert=function insert(req, res){
	var db= getConnection();
	db.setMaxListeners(0);

	var readPath =req.files.data.path;
	var deviceid = '';
	var ltime = '';
	fs.readFile(readPath, function (err, data) {
		if (err) throw err;
		zlib.gunzip(data , function(err, dezipped) {

			// Create the parser
			var parser = parse({delimiter: ',', columns:['deviceid','type','time','d1','d2','d3'], auto_parse: true, trim: true});

			// Use the writable stream api
			parser.on('readable', function(){
			while(record = parser.read()){
				db.collection("data").insert(record, function(err, result) {
					if (err) throw err;
					});
				deviceid = record.deviceid;
				ltime = record.time;
				}
			});
			// Catch any error
			parser.on('error', function(err){
				console.log(err.message);
			});
			// When we are done, log 
			parser.on('finish', function(){
				console.log('' + ltime + ":" + deviceid + ':Done Parsing');
			});

			// Now that setup is done, write data to the stream
			parser.write(dezipped.toString());
			// Close the readable stream
			parser.end();
			
		});

	});

	res.end("File Uploaded");
};


exports.getallpotholes=function getpotholes(req, res){
        var db= getConnection();
        db.setMaxListeners(0);

        var ths = req.query.th;
        if(ths == undefined) th=300;
        else th = parseInt(ths);
        console.log('th=' + th);

        db.collection("potholes").find({th:th}).toArray(function(err, items) {
		

                res.end(JSON.stringify({"a":items}));
                db.close();
        });
};

exports.getrashdriving=function calcrashdriving(req, res){
       var db= getConnection();
        db.setMaxListeners(0);

        db.collection("rashdriving").find({a:{$gt:250}}).toArray(function(err, items) {

                res.end(JSON.stringify(items));
                db.close();
        });

}

exports.calcrashdriving=function calcrashdriving(req, res){
        var db= getConnection();
        db.setMaxListeners(0);
        db.collection("potholes").find({th:200}).toArray(function(err, allpotholesabove200) 
		{
                	db.close();
			var prev = allpotholesabove200[0];
			var groups = [];
			var group = [];
			group.push(prev);
			groups.push(group);
			var finalRes = [];
			for(i=1; i<allpotholesabove200.length; i++)
			{
				var diff = allpotholesabove200[i].t - prev.t;
				if(diff < 1000) group.push(allpotholesabove200[i]);
				else { if(group.length==1) groups.pop(); else{ finalRes.push(group[0]);console.log(group.length);}  var newgrp = [allpotholesabove200[i]]; groups.push(newgrp);  group = newgrp;}
				prev = allpotholesabove200[i];
			}
//			console.log(groups);
//			console.log(groups.length);
//			res.end(JSON.stringify(groups));
			res.end('Success');
			db.collection("rashdriving").insert(finalRes,function(res,err){});

		});
};





exports.getpotholes=function getpotholes(req, res){
	var db= getConnection();
	db.setMaxListeners(0);

        var ths = req.query.th;
        if(ths == undefined) th=300;
        else th = parseInt(ths);
        console.log('th=' + th);
 
	db.collection("potholes").find({th:th}).toArray(function(err, items) {
		res.end(JSON.stringify(items));
	        db.close();
	});
};


exports.getclusters=function getclusters(req, res){
        var db= getConnection();
        db.setMaxListeners(0);
        db.collection("clusters").find().toArray(function(err, items) {
                res.end(JSON.stringify({"a":items}));
                db.close();
        });
};





exports.calcpotholes=function calcpotholes(req, res){
	var ths = req.query.th;
	if(ths == undefined) th=300;
	else th = parseInt(ths);
	console.log('th=' + th);
	calc(th);
        res.end("Calculating...");	
};



exports.calcall=function calcall()
{
	var sens = [250, 300, 350, 400];
	sens.forEach(function(s){ console.log("Calculating for Sensitivity = " + s);  calc(s) });
}




function calc(th)
{
        var i = 0;
        var db = getConnection();
        db.setMaxListeners(0);
        db.collection("potholes").remove({th:th}, function(err, d){});
        db.collection("data").aggregate( [ {$sort: { time: 1}}, {$skip: 1000}, {$match: {type: 'A'}},
                        { $project: { d: "$deviceid", t: "$time", a:{ $add: [ { $multiply:["$d1", "$d1"]}, { $multiply:["$d2", "$d2"]} ,
                        { $multiply:["$d3", "$d3"] } ] }, _id : 0 }  }, { $match: { a: {$gt: th}}}  ],  {allowDiskUse:true}, function(err, items) {
                console.log('First Query');
                items.forEach(function(d){
                        console.log("ForEach");
                        db.collection("data").find({deviceid:d.d ,type:'G', time : {$gt: d.t, $lt: d.t + 1200 }}).toArray(function(err, it) {
                                console.log("Second Query");
                                i++;
                                if(it != undefined && it[0] != undefined)
                                {
                                        d.x = it[0].d2; d.y = it[0].d3;
//                                      dist = 6400000 * 2 * Math.PI * Math.sqrt((d.x - 12.960295563367373)*(d.x - 12.960295563367373) + (d.y - 77.52550212841176)*(d.y - 77.52550212841176)) / 360.0;  // dist in metres
//                                      if(dist < 200) { console.log(d.t); return; }
//                                      d.t=undefined;
                                        d.th=th;
                                        d.a=Math.round(d.a,0);
                                        db.collection("potholes").insert(d, function(err, d){});
                                        if(i==items.length - 1) { db.close(); }
                                }
                        });
                });
        });

}



exports.getaccpoints=function getaccpoints(req, res){

	db.collection('data').aggregate( [ {$sort: { time: 1}}, {$skip: 1000}, {$match: {type: 'A'}}, 
		{ $project: { x: "$time", 
		y:{ $add: [ { $multiply:["$d1", "$d1"]}, { $multiply:["$d2", "$d2"]} , { $multiply:["$d3", "$d3"] } ] }, 
		_id : 0 }  }  ],  {allowDiskUse:true}, function(err, items) {
		var xmin = items[0].x;
		console.log(xmin);
		items.forEach(function(it){ it.x = (it.x - xmin) / 1000.00; it.y = Math.round(it.y, 0); });
                res.end(JSON.stringify(items));
                db.close();
        });
};


function getConnection(){
	var db = mongo.db(c.dbserver+"://"+c.host+":"+c.port+"/" + c.db, {native_parser:true});
	return db;
}
