class MusicPlayer{
	constructor(div){
		var that = this;
		this.el = div;
		this.serverPath = "http://localhost:3000/"
		this.el.append($("<div><h3>Sound Effects</h3></div>"));
		$.get(this.serverPath + "Titles",function(data){
			JSON.parse(data).forEach(function(trackName){
					console.log(trackName);
					var button = $("<button></button");
					button.text(trackName);
					button.click(function(){
						console.log(that.serverPath + trackName);
						$.get(that.serverPath + trackName,function(data){
							console.log(trackName);
						});
					})
					that.el.append(button);
			})

		})
		// Object.keys(this.player).forEach(function(trackName){
		// 	var button = $("<button>"+trackName+"</button");
		// 	button.click(that.player[trackName])
		// 	that.el.append(button);
		// })
	}
}