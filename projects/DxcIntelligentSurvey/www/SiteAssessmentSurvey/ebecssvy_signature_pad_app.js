var wrapper;
var clearButton;
var changeColorButton;
var undoButton;
var savePNGButton;
var saveJPGButton;
var saveSVGButton;
var canvas;
var signaturePad;

function LoadSignature(t, width, height) {
    wrapper = document.getElementById("signature-pad" + t);
    clearButton = wrapper.querySelector("[data-action=clear]");
    changeColorButton = wrapper.querySelector("[data-action=change-color]");
    undoButton = wrapper.querySelector("[data-action=undo]");
    savePNGButton = wrapper.querySelector("[data-action=save-png]");
    saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
    saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
    canvas = wrapper.querySelector("canvas");
    //debugger;
    signaturePad = new SignaturePad(canvas, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)'
    }, width, height);

    // On mobile devices it might make more sense to listen to orientation change,
    // rather than window resize events.
    window.onresize = resizeAll;
    
    //setTimeout(function () {
    resizeCanvas();
    //}, 100);  

    clearButton.addEventListener("click", function (event) {
        var sigId = $(event.currentTarget).parent().parent().parent().parent()[0].id.replace("signature-pad", "");
        var qIndex = findCrmEntityArrayIndex(QuestionsArray, sigId);
        var element = SignaturePadObjectArray[qIndex];
        //MobileCRM.bridge.alert("clear btn : " + sigId + " : " + qIndex + " : " + element);
        signaturePad.clear(element);
    });

    return signaturePad;
}

function resizeAll() {
   // setTimeout(function () {
        var canvasAmount = SignaturePadObjectArray.length
        for (var index = 0; index < canvasAmount; index++) {
            if (SignaturePadObjectArray[index] != undefined && SignaturePadObjectArray[index] != null) {
                //MobileCRM.bridge.alert("resize ALL : " + SignaturePadObjectArray[inde]._canvas.width + " : " + SignaturePadObjectArray[inde]._canvas.height);
                resizeCanvas(SignaturePadObjectArray[index]);
            }
        }
   // }, 100);      
}

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas(SigPad) {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.

    var sIndex = 0;
    var canv = canvas;
    var canvaswidth = signaturePad._canvasWidth;
    var canvasheight = signaturePad._canvasHeight;
    var dataURL = "";

    if (SigPad != undefined && SigPad != null) {
        canv = SigPad._canvas;
        sIndex = SigPad._canvas.id.replace("signature", "");
        canvaswidth = SigPad._canvasWidth;
        canvasheight = SigPad._canvasHeight;
        dataURL = SigPad.toDataURL().replace("data:image/png;base64,", "");
    }
    else {
        sIndex = wrapper.id.replace("signature-pad", "");
    }
    
    var curWidth = ($(".container")[0].offsetWidth / 12) * 8;    
    if ($(".container")[0].offsetWidth < 545) {
        curWidth = $(".container")[0].offsetWidth;
    }
    //MobileCRM.bridge.alert("resize canvas 1 : " + canv.width + " : " + canv.height + " : " + canvaswidth + " : " + canvasheight + " : " + curWidth);
    //var curWidth = $("#Answerid" + sIndex)[0].offsetWidth;
    //MobileCRM.bridge.alert("curWidth cont : " + curWidth);
    if (curWidth > canvaswidth) {
        $(canv).parent().parent()[0].style.width = canvaswidth;
        canv.width = canvaswidth - 32;//reducing borders' width
        //MobileCRM.bridge.alert("curWidth > canvaswidth");
    }
    else {
        $(canv).parent().parent()[0].style.width = curWidth - 25;
        canv.width = curWidth - 57;//reducing borders and answer area gap
        //MobileCRM.bridge.alert("ELSE")
    }
    $(canv).parent().parent()[0].style.height = canvasheight;
    canv.height = canvasheight - 82; //pure canvas height = outer div - (borders + signature footer height)
    //MobileCRM.bridge.alert("resize data : " + canv.width + " : " + canv.height + " : " + curWidth);
    // This part causes the canvas to be cleared
    //MobileCRM.bridge.alert(dataURL);    
    if (SigPad != undefined && SigPad != null && dataURL != undefined && dataURL != null && dataURL != "" && dataURL != "data:,") {
        var isEmpty = SigPad._isEmpty;
        SigPad.clear(SigPad);
        //MobileCRM.bridge.alert("not null dataURL");
        SigPad.fromDataURL(dataURL);
        SigPad._isEmpty = isEmpty;
        //canv.getContext("2d").scale(1, 1);
    }
    canv.getContext("2d").scale(1, 1);
    //MobileCRM.bridge.alert("final sizes : " + SigPad._canvas.width + " : " + SigPad._canvas.height);
    // This library does not listen for canvas changes, so after the canvas is automatically
    // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
    // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
    // that the state of this library is consistent with visual state of the canvas, you
    // have to clear it manually.
    //signaturePad.clear();
}

function download(dataURL, filename) {
    var blob = dataURLToBlob(dataURL);
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
