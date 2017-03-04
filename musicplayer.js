"use strict";
console.log("RUN");
var player = require('play-sound')({})
var fs = require("fs")
var app = require("express")();
app.get("/",function(req,res){
	res.end("HERE");
})


// player.play('soundeffects/doorcreak.mp3', { timeout: 300 }, function(err){
//   if (err) throw err
// })
 
// configure arguments for executable if any 

class MusicPlayer{
	constructor(pathToMP3s){
		var that = this;
		var files = fs.readdirSync(pathToMP3s)
		this.player = {};
		this.titles = [];
		files.forEach(function(path){
			var title = path.replace(".mp3","")
			that.titles.push(title);
			that.player[title] = 
			function(){
				that.playFile(pathToMP3s + "/" + path);
			}
			app.get("/" + title,function(req,res){
				res.header("Access-Control-Allow-Origin", "*");
 				res.header("Access-Control-Allow-Headers", "X-Requested-With");
				that.player[title]();
				res.send("Played");
			})
		})
		app.get("/Titles",function(req,res){
			res.header("Access-Control-Allow-Origin", "*");
  			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.send(JSON.stringify(that.titles));
		})


	}

	playFile(path){
		player.play(path, { afplay: ['-v', 1 ] /* lower volume for afplay on OSX */ }, function(err){
		   if (err) throw err
		})
		 
		// access the node child_process in case you need to kill it on demand 
		var audio = player.play(path, function(err){
		  if (err && !err.killed) throw err
		})
		audio.kill()

	}

}

var test = new MusicPlayer("soundeffects");

app.listen(3000);
//test.playFile("soundeffects/doorcreak.mp3");


// player.play('soundeffects/doorcreak.mp3', { afplay: ['-v', 1 ] /* lower volume for afplay on OSX */ }, function(err){
//    if (err) throw err
// })
 
// // access the node child_process in case you need to kill it on demand 
// var audio = player.play('soundeffects/doorcreak.mp3', function(err){
//   if (err && !err.killed) throw err
// })
// audio.kill()