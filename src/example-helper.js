function Firebase(url){
  var me = this;
  me.rootUrl = url;
  me.url = url;
  me.child = function(url){
    return new Firebase(me.url + "/"+ url);
  };

  me.push = function(){
    return new Firebase(me.url + "/asjdfha");
  }

  me.name = function(){
    return "a";
  }

  me.set = function(obj){

  }

  me.root = function(){
    return new Firebase(me.rootUrl);
  }

  me.on = function(eventType, callback, context){
    console.log(eventType);
    // value
    // child_added
    // child_changed
    // child_moved
    // child_removed
  }

  me.once = function(eventType, callback){
    console.log(eventType);
  }

  me.onDisconnect = function(){
    this.remove = function(){

    } 
    return this;
  }

};



function getDocumentRef() {
  // Get hash from end of URL or generate a random one.

  //var ref = new Firebase('https://blistering-fire-4747.firebaseio.com/');
  var ref = new Firebase('http://localhost:3000/');
  //var hash = window.location.hash.replace(/#/g, '');
  var hash = getParameterByName('d');
  if (hash) {
    ref = ref.child(hash);
  } else {
    ref = ref.push(); // generate unique location.
    window.location = window.location + '?d=' + ref.name(); // add it as a hash to the URL.
  }

  if (typeof console !== 'undefined')
    console.log('Firebase data: ', ref.toString());

  return ref;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
