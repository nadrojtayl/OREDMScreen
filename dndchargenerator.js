var request = require('request');
var cheerio = require('cheerio')

function scraper(className) {
	var page = 'http://www.d20srd.org/srd/classes/' + className + '.htm';
	request(page, function (error, response, body) {
  	if (!error && response.statusCode == 200) {
  	 var charObj = {};
     var $ = cheerio.load(body);
     var labels = [];
     var texts = [];
     //console.log(body);
     $("h5").next("p").each(function(ind,p){
     	texts.push(p.children[0].data);
     });
     $("h5").each(function(ind,p){
     	labels.push(p.children[0].data);
     });

     labels.forEach(function(label,ind){
     	charObj[label] = texts[ind];
     })

    
 	 var tabledata = $("table").find("tr").text().split(/\r?\n/);
 	 tabledata = tabledata.slice(1)
 	 var organizeddata = []
 	 var row = [];
		//console.log(tabledata[7] === "\t");
 	 tabledata.forEach(function(elem){

 	 	if(elem === "\t"){
 	 		
 	 		organizeddata.push(row);
 	 		row = [];
 	 	} else {
 	 		row.push(elem);
 	 	}
 	 })
 	 organizeddata = organizeddata.map(function(row){
 	 	return row.map(function(word){
 	 		return word.slice(2)
 	 	})
 	 })

 	 var levelData = {};
 	// console.log(organizeddata[0])
 	 organizeddata.slice(1).forEach(function(row,ind){
 	 	//console.log(row);
 	 	var obj = {};
 	 	row.forEach(function(val,index){
 	 		var label = organizeddata[0][index];
 	 		obj[label] = val;
 	 	})
 	 	levelData[ind+1] = obj;
 	 })

 	 charObj.levelData = levelData;

 	 console.log(charObj); 

  	}
	});
}

scraper("cleric");