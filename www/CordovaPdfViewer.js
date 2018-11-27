var exec = require('cordova/exec');

console.log('-------- INIT -----------');
window.addEventListener('orientationchange', onOrientationChange);

var viewerElement;
var documentSrc;
var documentTitle;
var iosVersion = "";
var isCurrentlyViewing = false;

function onOrientationChange(e) {
    if (!isCurrentlyViewing) {
        return;
    }

    var rect = viewerElement.getBoundingClientRect();
    console.log(rect);

    success = function() {
        console.log('onOrientationChange success');
    };
    error = function() {
        console.log('onOrientationChange error');
    };

    var top = rect.top
    if (iosVersion > 10.4) {
        top = top + 20
    }

    exec(success, error, "CordovaPdfViewer", "redim", [top, rect.left, rect.width, rect.height]);
}


exports.show = function(_viewerId, src, _title, success, error, _iosVersion="") {
    if (isCurrentlyViewing) {
        exec(function() {}, function() {}, "CordovaPdfViewer", "dismiss");
    }

    viewerId = _viewerId;
    documentSrc = src;
    documentTitle = _title;
    if (iosVersion != ""){
        iosVersion = _iosVersion
    }
    var extension = src.split('.').pop();

    console.log('Source ' + src);
    console.log('extension ' + extension);

    if (extension != 'pdf') {
        msg = 'File extension must be pdf';
        console.log(msg);
        error(msg);
        return;
    }

    var elem = document.getElementById(viewerId);
    if (!elem) {
        msg = 'Unable to find element with id ' + viewerId;
        console.log(msg);
        error(msg);
        return;
    }

    console.log('src=' + src);

    var rect = elem.getBoundingClientRect();
    console.log(rect);

    isCurrentlyViewing = true;
    viewerElement = elem;

    var top = rect.top
    if (iosVersion > 10.4) {
        top = top + 20
    }

    exec(success, error, "CordovaPdfViewer", "show", [src, documentTitle, top, rect.left, rect.width, rect.height]);
};

exports.redim = function(success, error, top, left, width, height) {
    if (!isCurrentlyViewing) {
        return;
    }
    console.log('Redim new');
    console.log(viewerId);
    console.log('src=' + documentSrc);
    console.log('src=' + documentTitle);
    console.log('iosVersion=' + iosVersion);
    console.log('now showing again');
    pdfViewer.show(viewerId, documentSrc, documentTitle, success, error, iosVersion); 
    //exec(success, error, "CordovaPdfViewer", "redim", [top, left, width, height]);
};

exports.autoRedim = function(_iosVersion) {
    console.log("kskskskskssk" + _iosVersion)
    console.log('autoRedim');
    var success = function() {};
    var error   = function() {};
    iosVersion = _iosVersion
    pdfViewer.redim(success, error, '', '', '', '');
};

exports.dismiss = function(success, error) {
    console.log('Dismiss');
    isCurrentlyViewing = false;
    exec(success, error, "CordovaPdfViewer", "dismiss");
};


exports.show2 = function(viewerId, src, success, error) {
    var elem = document.getElementById(viewerId);
    if (!elem) {
        msg = 'Unable to find element with id ' + viewerId;
        console.log(msg);
        error(msg);
        return;
    }
    elem.style.setProperty('overflow', 'auto');
    elem.style.setProperty('-webkit-overflow-scrolling', 'touch');

    var innerHTML = '<object style="width: 100%; height: 100%" data="' + src + '"></object>';
    elem.innerHTML = innerHTML;
    success();
};
