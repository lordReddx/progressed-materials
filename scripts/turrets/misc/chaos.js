//4 colors from outside in. Normal meltdown laser has trasnparrency 55 -> aa -> ff (no transparrency) -> ff(no transparrency)
var colors = [Color.valueOf("D99F6B55"), Color.valueOf("E8D174aa"), Color.valueOf("F3E979"), Color.valueOf("ffffff")];
var length = 900;
var width = 16;
var oscScl = 0.5;
var oscMag = 1;
var lightStroke = 60;

//Stuff you probably shouldn't edit unless you know what you're doing.
//Width of each section of the beam from thickest to thinnest
var tscales = [1, 0.7, 0.5, 0.2];
//Overall width of each color
var strokes = [2, 1.5, 1, 0.3];
//Determines how far back each section in the start should be pulled
var pullscales = [1, 1.12, 1.15, 1.17];
//Determines how far each section of the end should extend past the main thickest section
var lenscales = [1, 1.12, 1.15, 1.17];

const tmpColor = new Color();
const vec = new Vec2();
const vec2 = new Vec2();

var lightScale = 1;

var chargeLenScale = 0.75;
var chargeBeams = 20 / 2;
var widthScl = 0.75;
var rotateAmount = 360;
var chargeTime = 150;
var fadeTime = 30;

const chaosChargeBegin = new Effect(chargeTime, 1600 * chargeLenScale, e => {
  Draw.color(colors[0], colors[2], 0.5 + e.finpow() * 0.5);
  Lines.stroke(Mathf.lerp(0, 28, e.finpow()));
  Lines.circle(e.x, e.y, 384 * (1 - e.finpow()));
  
  for(var i = 0; i < 36; i++){
    vec.trns(i * 10, 384 * e.fout());
    vec2.trns(i * 10 + 10, 384 * e.fout());
    Drawf.light(e.data[0], e.x + vec.x, e.y + vec.y, e.x + vec2.x, e.y + vec2.y, 14 / 2 + lightStroke * lightScale * e.finpow(), Draw.getColor(), 0.7);
  }
  
  var fade = 1 - Mathf.curve(e.time, e.lifetime - fadeTime, e.lifetime);
  var grow = Mathf.curve(e.time, 0, e.lifetime - fadeTime);
  var baseLen = (length + (Mathf.absin(Time.time() / ((i + 1) * 2) + Mathf.randomSeed(e.id), 0.8, 1.5) * (length / 1.5))) * chargeLenScale * fade;
  
  for(var i = 0; i < 4; i++){
    Draw.color(tmpColor.set(colors[i]).mul(1.0 + Mathf.absin(Time.time() / 3 + Mathf.randomSeed(e.id), 1.0, 0.3) / 3));
    for(var j = 0; j < 2; j++){
      var dir = Mathf.signs[j];
      for(var k = 0; k < chargeBeams; k++){
        var side = k * (360 / chargeBeams);
        for(var l = 0; l < 4; l++){
          Lines.stroke((width * widthScl + Mathf.absin(Time.time(), oscScl, oscMag)) * grow * strokes[i] * tscales[l]);
          Lines.lineAngle(e.x, e.y, (e.rotation + rotateAmount * e.finpow() + side) * dir, baseLen * lenscales[l], false);
        }
        
        vec.trns((e.rotation + 360 * e.finpow() + side) * dir, baseLen * 1.1);
          
        Drawf.light(e.data[0], e.x, e.y, e.x + vec.x, e.y + vec.y, ((width * widthScl + Mathf.absin(Time.time(), oscScl, oscMag)) * grow * strokes[i] * tscales[j]) / 2 + lightStroke * lightScale * e.finpow(), colors[2], 0.7);
      }
    }
    Draw.reset();
  }
});

const duration = 114;

/*const chaosBeam = extend(ContinuousLaserBulletType, {
  update(b){
    this.super$update(b);
    
    Effect.shake(this.shake, 120, b);
  }
});*/

const chaosBeam = extend(LaserBulletType, {});

chaosBeam.colors = [Color.valueOf("F3E97966"), Color.valueOf("F3E979"), Color.white];
chaosBeam.length = length;
chaosBeam.width = 75;
chaosBeam.lightStroke = lightStroke;
chaosBeam.lightColor = colors[2];
chaosBeam.damage = Number.MAX_VALUE;
chaosBeam.lifetime = duration + 16;

chaosBeam.lightningSpacing = 35;
chaosBeam.lightningLength = 8;
chaosBeam.lightningDelay = 1.1;
chaosBeam.lightningLengthRand = 4;
chaosBeam.lightningDamage = Number.MAX_VALUE;
chaosBeam.lightningAngleRand = 40;
chaosBeam.largeHit = true;
chaosBeam.lightningColor = colors[2];

chaosBeam.sideAngle = 15;
chaosBeam.sideWidth = width / 10;
chaosBeam.sideLength = length / 10;

const chaosArray = extendContent(ChargeTurret, "chaos-array", {
  load(){
    this.baseRegion = Core.atlas.find("prog-mats-block-8");
    this.region = Core.atlas.find(this.name);
    this.heatRegion = Core.atlas.find(this.name + "-heat");
  },
  setStats(){
    this.super$setStats();
    
    this.stats.remove(Stat.damage);
    this.stats.add(Stat.damage, "oh no");
  }
});

chaosArray.shootType = chaosBeam;
chaosArray.chargeTime = chargeTime;
chaosArray.chargeSound = loadSound("chaoscharge");
chaosArray.shootSound = loadSound("chaosblast");
/*chaosArray.chargeSound = Sounds.lasercharge;
chaosArray.shootSound = Sounds.laserblast;*/
chaosArray.chargeBeginEffect = chaosChargeBegin;
chaosArray.size = 8;
chaosArray.shootDuration = duration;
chaosArray.shots = 100;
chaosArray.inaccuracy = 45;
chaosArray.shootY = -16;
chaosArray.shootShake = 150

const tmpCol = new Color();
const pow6In = new Interp.PowIn(6);

//More stolen code :D
chaosArray.heatDrawer = tile => {
	if(tile.heat <= 0.00001) return;
	var r = Interp.pow2Out.apply(tile.heat);
	var g = Interp.pow3In.apply(tile.heat) + ((1 - Interp.pow3In.apply(tile.heat)) * 0.12);
	var b = pow6In.apply(tile.heat);
	var a = Interp.pow2Out.apply(tile.heat);
	tmpCol.set(r, g, b, a);
	Draw.color(tmpCol);

	Draw.blend(Blending.additive);
	Draw.rect(chaosArray.heatRegion, tile.x + chaosArray.tr2.x, tile.y + chaosArray.tr2.y, tile.rotation - 90);
	Draw.blend();
	Draw.color();
};

const shootLoc = new Vec2();

chaosArray.buildType = () => {
	var chaosEntity = extendContent(ChargeTurret.ChargeTurretBuild, chaosArray, {
    setEff(){
      this._bulletLife = 0;
    },
    updateTile(){
      this.super$updateTile();
      shootLoc.trns(this.rotation, chaosArray.size * 4 - this.recoil + chaosArray.shootY);
      
      if(this._bulletLife > 0){
        this.heat = 1;
        this.recoil = chaosArray.recoilAmount;
        this._bulletLife -= Time.delta;
        
        if(this._bulletLife <= 0){
          this.shooting = false;
        }
      }
    },
    updateShooting(){
      if(this._bulletLife > 0){
        return;
      }
      
      if(this.reload >= chaosArray.reloadTime && !this.shooting){
        var type = this.peekAmmo();
        
        this.shoot(type);
        
        this.reload = 0;
      }else{
        this.reload += this.delta() * this.baseReloadSpeed();
      }
    },
    shoot(ammo){
      this.useAmmo();

      shootLoc.trns(this.rotation, chaosArray.size * 4 - this.recoil + chaosArray.shootY);
      chaosArray.chargeBeginEffect.at(this.x + shootLoc.x, this.y + shootLoc.y, Mathf.random(360), [this.team]);
      chaosArray.chargeSound.at(this.x + shootLoc.x, this.y + shootLoc.y, 1);
      
      this.shooting = true;

      Time.run(chaosArray.chargeTime, run(() => {
        this.recoil = chaosArray.recoilAmount;
        this.heat = 1;
        this._bulletLife = chaosArray.shootDuration;
        for(var i = 0; i < chaosArray.shots; i++){
          shootLoc.trns(this.rotation, chaosArray.size * 4 - this.recoil + chaosArray.shootY);
          this.bullet(ammo, this.rotation + Mathf.range(chaosArray.inaccuracy));
          chaosArray.shootSound.at(this.x + shootLoc.x, this.y + shootLoc.y, 1);
          Effect.shake(chaosArray.shootShake, chaosArray.shootShake, this);
        };
      }));
    },
    bullet(type, angle){
      shootLoc.trns(this.rotation, chaosArray.size * 4 - this.recoil);
      
      type.create(this, this.team, this.x + shootLoc.x, this.y + shootLoc.y, angle);
    },
  });
  
  return chaosEntity;
};