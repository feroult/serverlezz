// Custom JS code can go here

const OPEN_SUBTITLE_KEY = 'u';
const CLOSE_SUBTITLE_KEY = 'i';

const START_SMS_KEY = 'j';
const STOP_SMS_KEY = 'k';

var enableCommands = false;
var fullSubtitles = false;
var currentSubtitle;
var subtitleTimer;

// You can customize Reveal options:
Reveal.configure({
    center: false,
    controls: false,
    progress: false,
    transition: 'slide'
});

head.js("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min.js");
head.js("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js");
head.js("https://www.gstatic.com/firebasejs/4.5.0/firebase.js");
head.js("https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js");
head.js("js/sms.js");

head.ready("jquery.min.js", function () {
    const $ = jQuery;
    $('<div id="subtitle" class="normal" />').appendTo('body');
});

head.ready("firebase.js", function () {
    firebaseInit();
    handleSubtitles();
    handleCommands();
});

head.ready("keymaster.min.js", function () {
    key(OPEN_SUBTITLE_KEY, cmdOpenSubtitles);
    key(CLOSE_SUBTITLE_KEY, cmdCloseSubtitles);
    key(START_SMS_KEY, cmdStartSms);
    key(STOP_SMS_KEY, cmdStopSms);
});

function firebaseInit() {
    var config = {
        apiKey: "AIzaSyDnVN1AS06i2I3RB-gsmWd-2feIZs2AS4A",
        authDomain: "serverlezz.firebaseapp.com",
        databaseURL: "https://serverlezz.firebaseio.com",
        projectId: "serverlezz",
        storageBucket: "serverlezz.appspot.com",
        messagingSenderId: "439862729073"
    };
    firebase.initializeApp(config);
}


function handleSubtitles() {
    const $ = jQuery;

    const db = firebase.database();
    const ref = db.ref('subtitles');

    var init = false;
    ref.on('child_added', function (snap) {
        // if (enableCommands) {
        //     return;
        // }

        if (init) {
            var text = snap.val().text;
            var isFinal = snap.val().isFinal;

            if (!fullSubtitles) {
                $('#subtitle').html('<span class=\"' + (isFinal ? '' : '') + '\">' + text + '</span>');
                $('#subtitle').scrollTop($('#subtitle')[0].scrollHeight)

                if (subtitleTimer) {
                    clearTimeout(subtitleTimer);
                }

                subtitleTimer = setTimeout(function () {
                    $('#subtitle').html('');
                }, 5000);
            } else {
                if (!isFinal) {
                    if (!currentSubtitle) {
                        currentSubtitle = $('<span />');
                        $('#subtitle-content').append(currentSubtitle);
                    }
                    currentSubtitle.html(text);
                } else {
                    currentSubtitle.html(text + '. ');
                    currentSubtitle.addClass('is-final');
                    currentSubtitle = null;
                }

                if ($('#subtitle-content')[0].scrollHeight >= $('#subtitle')[0].scrollHeight) {
                    $('#subtitle-content').html(currentSubtitle);
                }
            }
        }
    });

    ref.once('value', function (snap) {
        init = true;
    });
}

function handleCommands() {
    const db = firebase.database();
    const ref = db.ref('commands');

    var init = false;
    ref.on('child_added', function (snap) {
        if (init) {
            const cmd = snap.val();
            console.log('enable', enableCommands, 'cmd', cmd);
            if (cmd.action === "enable") {
                enableCommands = true;
                $('#subtitle').html('');
                return;
            }
            if (cmd.action === "disable") {
                enableCommands = false;
                $('#subtitle').html('');
                return;
            }
            if (!enableCommands) {
                return;
            }
            if (cmd.action === "next") {
                cmdNext(cmd.params.times);
                return;
            }
            if (cmd.action === "previous") {
                cmdPrevious(cmd.params.times);
                return;
            }
            if (cmd.action === "open-subtitles") {
                cmdOpenSubtitles();
                return;
            }
            if (cmd.action === "close-subtitles") {
                cmdCloseSubtitles();
                return;
            }

        }
    });

    ref.once('value', function (snap) {
        init = true;
    });
}

function cmdNext(times) {
    for (var i = 0; i < times; i++) {
        Reveal.next();
    }
}

function cmdPrevious(times) {
    for (var i = 0; i < times; i++) {
        Reveal.prev();
    }
}

function cmdOpenSubtitles() {
    if (fullSubtitles) {
        return;
    }
    fullSubtitles = true;
    $('#subtitle').removeClass('normal');
    $('#subtitle').addClass('full');
    $('.reveal .slides').addClass('blur');
    $('#subtitle').html('<div id="subtitle-content" />');
    if (subtitleTimer) {
        clearTimeout(subtitleTimer);
    }
}

function cmdCloseSubtitles() {
    if (!fullSubtitles) {
        return;
    }
    fullSubtitles = false;
    $('#subtitle').removeClass('full');
    $('#subtitle').addClass('normal');
    $('.reveal .slides').removeClass('blur');
    $('#subtitle').html('');
    if (subtitleTimer) {
        clearTimeout(subtitleTimer);
    }
}

function cmdStartSms() {
    SMS.start();
}

function cmdStopSms() {
    SMS.stop();
}
