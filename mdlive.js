/* global TocMaker */
/* global Firepad */
/* global ace */
/* global Firebase */
/* global marked */
window.onload = function () {
    //// Initialize Firebase.
    var ref = new Firebase("https://mdlive.firebaseio.com");
    function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            loadApp(ref, authData);
        } else {
            console.log("User is logged out");
            login(ref);
        }
    }
    ref.onAuth(authDataCallback);
};



function login(ref) {
    ref.authWithOAuthRedirect("google", authHandler);
}

function authHandler(error, authData) {
    if (error) {
        console.log("Login Failed!", error);
    } else {
        console.log("Authenticated successfully with payload:", authData);
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function configureMarked() {
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
}

function getDocRef(ref) {
    var hash = getParameterByName('d');
    if (hash) {
        ref = ref.child(hash);
    } else {
        ref = ref.push(); // generate unique location.
        window.location.href = window.location + '?d=' + ref.key(); // add it as a hash to the URL.
    }
    if (typeof console !== 'undefined')
        console.log('Firebase data: ', ref.toString());
    return ref;
}

function removeSplashScreen() {
    setTimeout(function () {
        var splash = document.getElementById('splash');
        if (splash) {
            splash.remove();
        }
    }, 1000);
}


var updateMarkdown = function (mdtext) {
    var mdText = '\n[TOC]\n\n' + mdtext;
    var md = document.getElementById('md-preview');
    //var converter = new Markdown.Converter();
    //md.innerHTML = converter.makeHtml(mdText);

    // Synchronous highlighting with highlight.js
    marked.setOptions({
        highlight: function (code, lang, callback) {
            return prettyPrintOne(code, lang, 1);
        }
    });
    md.innerHTML = marked(mdText);

    // Prettify
    // var codeEls = document.getElementsByTagName('code');
    // for (var i=0, ii=codeEls.length; i<ii; i++) {
    //   var codeEl = codeEls[i];
    //   var lang = codeEl.className;
    //   codeEl.className = 'prettyprint lang-' + lang;
    // }
    //prettyPrint();

    // Style tables
    var tableEls = document.getElementsByTagName('table');
    for (var i = 0, ii = tableEls.length; i < ii; i++) {
        var tableEl = tableEls[i];
        tableEl.className = 'table table-striped table-bordered';
    }

    TocMaker && TocMaker.init('md-preview'/*,"http://localhost/md-preview/"*/); //TOC MAKER

};

function syncScroll() {
    var srl = document.getElementsByClassName('ace_scrollbar')[0];
    var preview = document.getElementById('md-preview');

    function onScrollEventHandler(ev) {
        //http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#event-type-scroll
        // var perc = srl.scrollTop * 100 / srl.scrollHeight;
        // preview.scrollTop = preview.scrollHeight * perc / 100;
        preview.scrollTop = ((preview.scrollHeight - preview.clientHeight) * srl.scrollTop) / (srl.scrollHeight - srl.clientHeight);
    }
    if (srl.addEventListener)
        srl.addEventListener('scroll', onScrollEventHandler, false);
    else if (srl.attachEvent)
        srl.attachEvent('onscroll', onScrollEventHandler);
}

function loadApp(ref, authData) {
    configureMarked();
    ref = getDocRef(ref);

    //// Create ACE
    var editor = ace.edit("firepad-container");
    editor.setTheme("ace/theme/textmate");

    var userId = authData.uid.replace(':', '');

    var session = editor.getSession();
    session.setUseWrapMode(true);
    session.setUseWorker(false);
    session.setMode("ace/mode/markdown");
    document.getElementById('firepad-container').style.fontSize = '16px';
    
    //// Create Firepad.
    var firepad = Firepad.fromACE(ref, editor, {
        userId: userId
    });
    
    //// Initialize contents.
    firepad.on('ready', function () {
        syncScroll();

        editor.on("change", function () {
            updateMarkdown(firepad.getText());
        });
        if (firepad.isHistoryEmpty()) {
            firepad.setText('# Markdown Here');
        } else {
            updateMarkdown(firepad.getText());
        }
        editor.resize();

        removeSplashScreen();
        // initSlidesPlugin(firepad);
        // if (!!getParameterByName('slides')) {
        //     var $http = angular.element(window.document.getElementsByTagName('HTML')[0]).injector().get('$http');
        //     $http.get('revealTpl.html')
        //         .then(function (response) {
        //             var revealTpl = response.data;
        //             var slides = markdownToRevealSlides(firepad.getText());
        //             revealTpl = revealTpl.replace(/(<div id="slides-region" class="slides">)(<\/div>)/gmi, '$1' + slides.join('') + '$2');
        //             window.document.write(revealTpl);
        //         });
        // };
    });
}
