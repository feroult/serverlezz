// Custom JS code can go here

// You can customize Reveal options:
Reveal.configure({
    center: false,
    controls: false,
    progress: false,
    transition: 'slide'
});

head.ready("jquery.min.js", function () {
    const $ = jQuery;
    $('<div id="subtitle" />').appendTo('body');
});

head.ready("firebase.js", function () {
    const $ = jQuery;

    var config = {
        apiKey: "AIzaSyDnVN1AS06i2I3RB-gsmWd-2feIZs2AS4A",
        authDomain: "serverlezz.firebaseapp.com",
        databaseURL: "https://serverlezz.firebaseio.com",
        projectId: "serverlezz",
        storageBucket: "serverlezz.appspot.com",
        messagingSenderId: "439862729073"
    };
    firebase.initializeApp(config);

    const db = firebase.database();
    const ref = db.ref('subtitles');

    var init = false;
    ref.on('child_added', function (snap) {
        if (init) {
            const text = snap.val().text;
            const isFinal = snap.val().isFinal;
            $('#subtitle').html('<span class=\"' + (isFinal ? 'is-final' : '') + '\">' + text + '</span>');
        }
    });

    ref.once('value', function (snap) {
        init = true;
    });
});

head.js("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js");
head.js("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js");
head.js("https://www.gstatic.com/firebasejs/4.5.0/firebase.js");


