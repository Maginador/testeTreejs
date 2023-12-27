
let data = 0;
let progress = 0;
let loaderElement;
let progressbarElement;
let progressText;
let loaded = false;

function prepareLoaderUI() {
    progressbarElement = document.getElementsByClassName("progressbar")[0];
    loaderElement = document.getElementsByClassName("loader")[0];
    progressText = document.getElementsByClassName("progresstext")[0];
    loaderElement.style.display = "none";
}

function initLoading(totalData, progressCallback) {
    loaderElement.style.display = "block";
    progress = 0;
    loaded = false;
    data = totalData;
}

function updateProgress(progress) {

    let percentProgress = calculateProgress(progress);
    if (progressbarElement) progressbarElement.style.width = percentProgress + "%";
    progressText.innerText = percentProgress + "%";
    if (percentProgress >= 99) {
        loaded = true;
        loaderElement.style.display = "none";
    }

}

function isLoaded() {

    return loaded;
}
function calculateProgress(progress) {
    return parseInt(progress / data * 100);
}
prepareLoaderUI();
