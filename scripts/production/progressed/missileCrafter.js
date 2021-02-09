const multiLib = require("multi-lib/library");

const shellPress = multiLib.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "missile-crafter", [
  /*default form for each recipes. You can change values.
  {
    input: {
      items: [],     Modded Item:  "mod-name-item-name/amount", Vanilla Item: "item-name/amount"
      liquids: [],   Modded Liquid:  "mod-name-liquid-name/amount",  Vanilla liquid: "liquid-name/amount"
      power:0,
    },
    output: {
      items: [],
      liquids: [],
      power: 0,
    },
    craftTime: 80,
  },*/
  
  //region missiles
  
  {//1 (Basic Missile)
    input: {
      items: ["prog-mats-missile-shell/1", "thorium/20", "blast-compound/25"],
      power: 3
    },
    output:{
      items: ["prog-mats-basic-missile/1"]
    },
    craftTime: 60
  },
  {//2 (Emp Missile)
    input: {
      items: ["prog-mats-missile-shell/1", "lead/30", "titanium/30", "silicon/25"],
      power: 4
    },
    output:{
      items: ["prog-mats-emp-missile/1"]
    },
    craftTime: 90
  },
  {//2 (Quantum Missile)
    input: {
      items: ["prog-mats-missile-shell/1", "thorium/10", "phase-fabric/15", "silicon/10"],
      power: 7
    },
    output:{
      items: ["prog-mats-quantum-missile/1"]
    },
    craftTime: 90
  },
  
  //endregion
  //region nukes
  
  {//1 (Basic Nuke)
    input: {
      items: ["prog-mats-nuke-shell/1", "thorium/25", "phase-fabric/25", "prog-mats-techtanite/30"],
      power: 6
    },
    output:{
      items: ["prog-mats-basic-nuke/1"]
    },
    craftTime: 60
  },
  {//2 (Emp Nuke)
    input: {
      items: ["prog-mats-nuke-shell/1", "silicon/30", "surge-alloy/20", "prog-mats-techtanite/40"],
      power: 8
    },
    output:{
      items: ["prog-mats-emp-nuke/1"]
    },
    craftTime: 90
  },
  {//3 (Cluster Nuke) (Nuke Exclusive)
    input: {
      items: ["prog-mats-nuke-shell/1", "prog-mats-basic-missile/5", "copper/30", "plastanium/15"],
      power: 6.25
    },
    output:{
      items: ["prog-mats-cluster-nuke/1"]
    },
    craftTime: 90
  }
], {
  /*you can customize block here. ex) load()*/
},
/*this is Object constructor. This way is much better than literal way{a:123}
you can replace this with {} if you don't want to modify entity*/
function Extra(){
  /*you can use customUpdate = function(){}. this function excuted before update()
  also this.draw = function(){}
  you can customize entity here.
  ex)
  this._myProp=0;
  this.getMyProp=function(){
      return this._myProp;
  };
  this.setMyProp=function(a){
      this._myProp=a;
  };*/
});
/*
YOU MUST NOT MODIFY VALUE OF THESE
configurable
outputsPower
hasItems
hasLiquids
hasPower
*/

shellPress.itemCapacity = 50;
shellPress.liquidCapacity = 50;
shellPress.size = 4;
shellPress.health = 100;
shellPress.craftEffect = Fx.pulverizeMedium;
shellPress.updateEffect = Fx.none;
/*true: dump items and liquids of output according to button
false: dump items and liquids of output unconditionally*/
shellPress.dumpToggle = true;
shellPress.category = Category.crafting;
shellPress.buildVisibility = BuildVisibility.sandboxOnly;
shellPress.requirements = ItemStack.with(Items.copper,75);