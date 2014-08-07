function getDocumentRef() {
  // Get hash from end of URL or generate a random one.

  var ref = new Firebase('https://mdlive.firebaseio.com/');
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
