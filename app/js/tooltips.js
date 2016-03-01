var btns = document.querySelectorAll('.btn-comp');

for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('mouseleave', function(e) {
        e.currentTarget.setAttribute('class', 'btn-comp');
        e.currentTarget.removeAttribute('title');
//        $('.tooltip-inner').html("Copy this code");  
    });
}

function showTooltip(elem, msg) {
    elem.setAttribute('class', 'btn');
    elem.setAttribute('title', msg);
//    $('.tooltip-inner').html(msg);
}

// Simplistic detection, do not use it in production
function fallbackMessage(action) {
    var actionMsg = '';
    var actionKey = (action === 'cut' ? 'X' : 'C');

    if(/iPhone|iPad/i.test(navigator.userAgent)) {
        actionMsg = 'No support :(';
    }
    else if (/Mac/i.test(navigator.userAgent)) {
        actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
    }
    else {
        actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
    }

    return actionMsg;
}

//hljs.initHighlightingOnLoad();
