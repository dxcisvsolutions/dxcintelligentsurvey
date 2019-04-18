var renderingWaitDelay = 10;
var singleStepAnimation = 10;

function createElement(type, className, style, text) {
    var elem = document.createElement(type);
    elem.className = className;
    for (var prop in style) {
        elem.style[prop] = style[prop];
    }
    elem.innerHTML = text;
    return elem;
}

function createStatusBar(stages, stageWidth, currentStageIndex) {
    var statusBar = createElement('div', 'sas-status-bar', '', '');
    var currentStatus = createElement('div', 'sas-current-status', {}, '');

    //setTimeout(function () {
    //    currentStatus.style.width = (100 * currentStageIndex) / (stages.length - 1) + '%';
    //    currentStatus.style.transition = 'width ' + (currentStageIndex * singleStepAnimation) + 'ms linear';
    //}, renderingWaitDelay);

    statusBar.appendChild(currentStatus);
    return statusBar;
};

function checkSpaceforNonCurrentDotText(currentStageText, wrapperWidth) {
    var spaceleft = wrapperWidth - (currentStageText.length * 3) - 40;   
    return spaceleft;
}

function createCheckPoints(stages, currentStageText, currentStageIndex,traversedTabList, isRetake, wrapperWidth) {
    var ul = createElement('ul', 'sas-progress-bar', {}, '');
    var animationDelay = renderingWaitDelay;
    var currentStageWidth = currentStageText.length * 3 + 50;
    var equalStageWidth = wrapperWidth / stages.length;
    var stageWidth = (wrapperWidth - currentStageWidth) / (stages.length - 1);
    var isEqualsizes = true;
    if (currentStageWidth > equalStageWidth) {
        isEqualsizes = false;
        if (stageWidth < 50) {
            stageWidth = 50;
        }
    }

    //MobileCRM.bridge.alert("wrapperWidth " + wrapperWidth + " currentStageWidth : " + currentStageWidth + " stageWidth: " + stageWidth + "");
    
    for (var index = 0; index < stages.length; index++) {
        var li, dotDiv, textDiv = null;
        //li = createElement('li', '', '', '');
        if (isEqualsizes) {
            //MobileCRM.bridge.alert("isEqualsizes " + 100 / (stages.length) +"%")
            li = createElement('li', '', { 'display': 'inline-block', width: 100 / (stages.length) + '%' }, '');
        }
        else {
            if (currentStageIndex == index) {
                li = createElement('li', '', { 'display': 'inline-block', width: 'calc(100% - ' + stageWidth * (stages.length - 1) + 'px)' }, '');
            }
            else {
                li = createElement('li', '', { 'display': 'inline-block', width: stageWidth + 'px' }, '');
            }
        }
        if (index == 0) {
            dotDiv = createElement('div', 'dot', '', '');
            textDiv = createElement('div', 'section', { 'margin-right': 'auto', 'text-align': 'left', 'padding-right': '10px' }, stages[index]);
        }
        else if (index == stages.length - 1) {
            dotDiv = createElement('div', 'dot', { 'margin-left': 'auto' }, '');
            textDiv = createElement('div', 'section', { 'margin-left': 'auto', 'text-align': 'right', 'padding-left': '10px' }, stages[index]);
        }
        else {
            dotDiv = createElement('div', 'dot', { 'margin': 'auto' }, '');
            textDiv = createElement('div', 'section', { 'padding-left': '10px', 'padding-right': '10px' }, stages[index]);
        }

        if (currentStageIndex == index) {
            dotDiv.className += ' visited current';
        }
        else if (traversedTabList.indexOf(index.toString()) > -1) {
            dotDiv.className += ' visited';
            dotDiv.innerHTML = '&#x2714';
        }
        if (li != null && dotDiv != null && textDiv != null) {
        }
        li.appendChild(dotDiv);
        li.appendChild(textDiv);
        ul.appendChild(li);
    }
    return ul;
}


function createHTML(wrapper, stages, currentStage,traversedTabList, isRetake) {
    var stageWidth = 100 / stages.length;
    var currentStageIndex = stages.indexOf(currentStage);
    //create status bar
    var statusBar = createStatusBar(stages, stageWidth, currentStageIndex);
    wrapper.appendChild(statusBar);

    //create checkpoints
    var checkpoints = createCheckPoints(stages, currentStage, currentStageIndex,traversedTabList, isRetake, wrapper.offsetWidth);
    wrapper.appendChild(checkpoints);

    return wrapper;
}

function ShowProgressBar(stages, currentStage, isRetake, traversedTabList, container) {
    var wrapper = document.getElementsByClassName(container);
    if (wrapper.length > 0) {
        wrapper = wrapper[0];
    } else {
        MobileCRM.bridge.alert('progress bar not found');
        //wrapper = createElement('div', 'progress-bar-wrapper', {}, '');
        //document.body.appendChild(wrapper);
    }
    wrapper.innerHTML = "";
    createHTML(wrapper, stages, currentStage,traversedTabList, isRetake);
}