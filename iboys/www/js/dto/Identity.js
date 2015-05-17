'use strict';
function Identity(){
   this.id = undefined;
   this.sid = undefined;
   this.login = undefined;
   this.password = undefined;
   this.roleList = [];
}
Identity.prototype.setId = function(id){
   this.id = id;
};
Identity.prototype.setSid = function(sid){
   this.sid = sid;
};
Identity.prototype.setLogin = function(login){
   this.login = login;
};
Identity.prototype.setPassword = function(password){
   this.password = password;
};
Identity.prototype.setRoleList = function(roleList){
   this.roleList = roleList.slice();
};
Identity.prototype.addRole = function(role){
   this.roleList.push(role);
};
Identity.prototype.hasRole = function(role){
   role = (role || '').toUpperCase();
   for(var i = 0; i < this.roleList.length; i++){
      var element = (this.roleList[i] || '').toUpperCase();
      if(element.indexOf(role) > -1){
         return true;
      }
   }
   return false;
};

Identity.prototype.getId = function(){
   return this.id;
};
Identity.prototype.getSid = function(){
   return this.sid;
};
Identity.prototype.getLogin = function(){
   return this.login;
};
Identity.prototype.getPassword = function(){
   return this.password;
};
Identity.prototype.getRoleList = function(){
   return this.roleList;
};
Identity.prototype.build = function(object){
   this.id = object.id;
   this.sid = object.sid;
   this.login = object.login;
   this.password = object.password;
   this.roleList = object.roleList;
};

Identity.prototype.toString = function(){
   return '[Identity: id=' + this.getId()
      + ' sid=' + this.getSid()
      + ' login=' + this.getLogin()
      + ' password=' + this.getPassword()
      + ' roleList=' + this.getRoleList();
};
