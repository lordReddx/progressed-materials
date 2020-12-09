module.exports = (bullet) => {
  const b = new StatValue({
    display(table){
      table.row();
      
      const type = bullet;
      
      if(type.damage > 0 && (type.collides || type.splashDamage <= 0)){
        this.sep(table, Core.bundle.format("bullet.damage", type.damage));
      }

      if(type.splashDamage > 0){
        this.sep(table, Core.bundle.format("bullet.splashdamage", type.splashDamage, Strings.fixed(type.splashDamageRadius / Vars.tilesize, 1)));
      }

      if(type.knockback > 0){
        this.sep(table, Core.bundle.format("bullet.knockback", Strings.fixed(type.knockback, 1)));
      }

      if(type.healPercent > 0){
        this.sep(table, Core.bundle.format("bullet.healpercent", type.healPercent));
      }

      if(type.pierce || type.pierceCap != -1){
        this.sep(table, type.pierceCap == -1 ? "@bullet.infinitepierce" : Core.bundle.format("bullet.pierce", type.pierceCap));
      }

      if(type.status == StatusEffects.burning || type.status == StatusEffects.melting || type.incendAmount > 0){
        this.sep(table, "@bullet.incendiary");
      }

      if(type.status == StatusEffects.freezing){
        this.sep(table, "@bullet.freezing");
      }

      if(type.status == StatusEffects.tarred){
        this.sep(table, "@bullet.tarred");
      }

      if(type.status == StatusEffects.sapped){
        this.sep(table, "@bullet.sapping");
      }

      if(type.homingPower > 0.01){
        this.sep(table, "@bullet.homing");
      }

      if(type.lightning > 0){
        this.sep(table, "@bullet.shock");
      }

      if(type.fragBullet != null){
        this.sep(table, "@bullet.frag");
      }
      
      table.row();
    },
    sep(table, text){
      table.row();
      table.add(text);
    }
  });
  
  return b;
};