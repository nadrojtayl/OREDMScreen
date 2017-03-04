"use strict";

var hitLocations ={
	1: "Left Leg",
	2: "Right Leg",
	3: "Left Arm",
	4: "Left Arm",
	5: "Right Arm",
	6: "Right Arm",
	7: "Torso",
	8: "Torso",
	9: "Torso",
	10: "Head"
}

class HPbox{
	constructor(app){
		this.el = $("<input type='checkbox'>")
		var that = this;
		this.el.click(function(){
			that.dead = true;
			app.render();
		})
		this.dead = false;
	}

	render(div){
		//console.log("hp",this.dead); 
		if(!this.dead){
			div.append(this.el);
			return true;
		}
		this.el.remove()
		return false;
	}

}
class Limb{
	constructor(HPTotal,name,app){
		this.el = $("<div><label>"+name+"</label></div>");
		//TO DO SET BORDER
		//CHANGE CSS SO THEY APPEAR NLINE
		this.HP = [];
		this.living = true;
		for(var i = 0;i< HPTotal;i++){
			this.HP.push(new HPbox(app));
		}
	}
	render(div){
		var that = this;
		that.living = false;
		this.HP.forEach(function(hitPoint){
			if(hitPoint.render(that.el)){
				that.living = true;
			};
		})
		if(that.living){
			div.append(that.el);
		}
		if(that.living === false){
			this.el.remove();
		}
		return that.living;
	}
}

class Creature{
	constructor(headHP,torsoHP,limbHP,name,app,attackName,attackDice,attackDamageMod){
		var that = this;
		this.renderedAttack = false;
		this.el = $("<div><label>"+name+"</label></div>");
		this.living = true;
		this.limbs = {
			head: new Limb(headHP,"Head",app),
			torso: new Limb(torsoHP,"Torso",app),
			leftLeg: new Limb(limbHP,"Left Leg",app),
			rightLeg: new Limb(limbHP,"Right Leg",app),
			leftArm: new Limb(limbHP,"Left Arm",app),
			rightArm: new Limb(limbHP,"Right Arm",app)
		}
		this.attackName = attackName;
		//console.log("NAME",attackName);
		this[attackName] = function(){
			var result = OREroller(attackDice)
			if(result === false){
				console.log("The creature missed")
				return "The creature missed";
			} else {
				var str = "The " + name + " does ";
				result.forEach(function(tuple,ind){
					str += tuple[1] + attackDamageMod + " damage to the " + hitLocations[tuple[0]]
					if(ind !== result.length-1){
						str += " or "
					}
				})
				console.log(str);
				return str;
			}
		}

		//SET FLEXBOX
	}
	render(div){
		var that = this;
		this.living = true;
		Object.keys(that.limbs).forEach(function(limb){
			var limbname = limb;
			limb = that.limbs[limb];
			//console.log(limbname);
			if(!limb.render(that.el) && (limbname === "head" || limbname === "torso")){
				that.living = false;
			}
		})
		if(that.living === false){
			this.el.remove();
		}
		if(this.renderedAttack === false){
			var button = $("<button>"+ that.attackName+"</button>")

			button.click(this[that.attackName]);
			this.el.append(button);
			if(this.living){
				div.append(this.el);
			}
			this.renderedAttack = true;
		}

	}

}

class OREEnemyTracker{
	constructor(div){
		var that = this;
		this.monsters = [];
		this.el = div;
		this.attackTracker = $("div");
		this.addCreatureButton = $("<button> Add Creature</button>")
		this.input = $("<input></input>")
		this.addCreatureButton.click(function(){
			console.log(that.input.innerHTML);
			// console.log(addedCreature)
			// that.addEnemy()
		})
	}

	addEnemy(headHP,torsoHP,limbHP,name,attackName,attackDice,attackDamageMod){
		this.monsters.push(new Creature(headHP,torsoHP,limbHP,name,this,attackName,attackDice,attackDamageMod));
		this.render();
	}

	render(){
		console.log("Rerender");
		var that = this;
		this.monsters.forEach(function(monster){
			monster.render(that.el,that.render.bind(that));
		})
		this.el.append(this.input);
		this.el.append(this.addCreatureButton);
		this.el.append(this.attackTracker);
	}
}

function OREroller(numberdie){
	var rolls = {};
	var match = false;
	for(var i = 0;i < numberdie;i++){
		var dieroll = Math.ceil(Math.random() * 10);
		if(rolls[dieroll] === undefined){
			rolls[dieroll] = 1;
		} else {
			rolls[dieroll] = rolls[dieroll]+1;
			match = true;
		}
	}

	if(!match){
		return false;
	} else {
		console.log(rolls);
		return Object.keys(rolls).map(function(key){return [key,rolls[key]]}).filter(function(tuple){return tuple[1]>1})
	}
}

class SkillsObject{
	constructor(){
		var Body = {
			Athletics:0,
			Block: 0,
			Brawl: 0,
			Endurance: 0,
			Weapon: 0
		},
		Coordination = {
			Dodge: 0,
			Drive: 0,
			Lockpicking: 0,
			Stealth: 0,
			Weapon: 0
		},
		Sense = {
			Empathy: 0,
			Perception: 0,
			Scrutiny: 0
		},
		Mind = {
			First_Aid: 0,
			Knowledge: 0,
			Language: 0,
			Medicine: 0,
			Navigation: 0,
			Research: 0,
			Security_Systems: 0,
			Streetwise:0,
			Survival: 0,
			Tactics: 0 
		},
		Charm = {
			Lie: 0,
			Perform: 0,
			Persuasion: 0
		},
		Command = {
			Interrogation: 0,
			Intimidation: 0,
			Leadership:0,
			Stabiliy: 0
		}

		this.skills = {
			Body: Body,
			Coordination: Coordination,
			Sense: Sense,
			Mind: Mind,
			Charm: Charm,
			Command: Command
		}
	}

	addSkills(obj){
		var that = this;
		Object.keys(obj).forEach(function(skill){
			Object.keys(that.skills).forEach(function(attr){
				var ind = Object.keys(that.skills[attr]).indexOf(skill);
				if(ind !== -1){
					that.skills[attr][skill] = obj[skill]
				}
			})
		})
		
	}

	returnSkills(){
		return this.skills;
	}

	rollSkill(str){
		return OREroller(this.skills[str])
	}
}

var test = new SkillsObject;
test.addSkills({"Interrogation":5,"Intimidation":6})
console.log(test.skills)