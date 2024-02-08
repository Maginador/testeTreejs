import * as THREE from 'three';

let boxClose, boxCloseComment;
let commentWindow, commentText, submitComment, cancelComment, updateComment;
let vertexList = [];
let metricsList = [];
let measureListElement;
let closeListElement;

let commentsDataList = [];
let commentsList = [];
let commentsListElement;
let commentsCloseListElement;
let commentCloseList = [];
let commentNameList = [];
let commentMarkers = [];
let editionIndex = -1;

const commentColor = 0x00ffff;
const commentHightlightColor = 0xffffff
let measureList = [];
let closeList = [];
let measureNameList = [];
let measureMarkers = [];
let canUseRuler = true;
let canUseComment = true, commentAlreadyRunning = false;
let commentPosition;
const markerSize = 2;
const markerHsegments = 12;
const markerWsegments = 12;

let refSphere;

let offset = 0.04;
let iterations = 2;
window.canClick = false;
function PickRulerPoint(objects) {
    let dist = 99999;
    let index = -1;
    for (let i = 0; i < objects.length; i++) {
        if (dist > objects[i].distance) {
            dist = objects[i].distance;
            index = i;
        }
    }

    //constants 
    if (!objects[index])
        return null;
    else {
        return pickClosestVertex(objects[index]);
    }


}

function pickClosestVertex(object){
    var vertices;
    var resultPos;
    if(object.object.geometry.attributes) {
        vertices = object.object.geometry.attributes.position;
        var closest = 99999;
        for(var i = 0; i<vertices.array.length; i += 3){
            var pos = new THREE.Vector3(vertices.array[i],vertices.array[i+1],vertices.array[i+2]);

            if(closest > object.point.distanceTo(pos)){
                closest = object.point.distanceTo(pos);
                resultPos = pos;
            }
        }
    }
    else {
        vertices = object.object.geometry.vertices;
        var closest = 99999;
        for(var i = 0; i<vertices.length; i+=3){
            var pos = vertices[i];
            if(closest > object.point.distanceTo(pos)){
                closest = object.point.distanceTo(pos);
                resultPos = pos;
            }
        }
    }
    
    return resultPos;
}
function AddLine(v1, v2) {

    const material = new THREE.LineBasicMaterial({ color: 0xff00 });
    const points = [];
    points.push(v1);
    points.push(v2);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    material.depthTest = false;
    const line = new THREE.Line(geometry, material);
    line.renderOrder = 1;
    scene.add(line);
    return line;
}

function HideSphere() {
    if (refSphere) refSphere.visible = false;

}

function MovePoint(point) {
    if (metricsList.length >= 8) return;
    if (!refSphere) {
        const geometry = new THREE.SphereGeometry(markerSize, markerHsegments, markerWsegments);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        material.depthTest = false;
        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.set(point.x + (markerSize / 2), point.y + (markerSize / 2), point.z + (markerSize / 2));
        sphere.renderOrder = 1;

        scene.add(sphere);
        refSphere = sphere;
    }

    refSphere.visible = true;
    refSphere.position.set(point.x, point.y, point.z);
}
function AddPoint(point) {

    const geometry = new THREE.SphereGeometry(markerSize, markerHsegments, markerWsegments);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    material.depthTest = false;
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(point.x + (markerSize / 2), point.y + (markerSize / 2), point.z + (markerSize / 2));
    sphere.renderOrder = 1;

    scene.add(sphere);
    vertexList.push(sphere.position);
    measureMarkers.push(sphere);

}

window.RulerRaycast = function RulerRaycast(camera, sceneArray) {

    // calculate objects intersecting the picking ray
    let intersects = [];
    raycaster.setFromCamera(pointer, camera);
    
    intersects = intersects.concat(raycaster.intersectObjects(sceneArray));

    for(let i = 1; i<iterations; i++){
        raycaster.setFromCamera(new THREE.Vector2(pointer.x +0, pointer.y +offset*i), camera);
        intersects = intersects.concat(raycaster.intersectObjects(sceneArray));

        raycaster.setFromCamera(new THREE.Vector2(pointer.x +0, pointer.y -offset*i), camera);
        intersects = intersects.concat(raycaster.intersectObjects(sceneArray));
    }

    const point = PickRulerPoint(intersects);
    if (!point) {
        HideSphere();
        return;
    }
    MovePoint(point);
}
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clickPointer = new THREE.Vector2();
const limitThreshold = 0.1;
function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function UpdateCommentsFields(){
    if (!commentsListElement) {
        commentsListElement = document.getElementById("commentsList");
    }
    if (!commentsCloseListElement) {
        commentsCloseListElement = document.getElementById("commentsCloseList");
    }
    var diff = commentsDataList.length - commentsList.length;
    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            var name = document.createElement("div");
            name.className = "commentName";
            var trash = document.createElement("div");
            trash.innerHTML = "X";
            trash.style.height = "18px";
            //element.appendChild(trash);
            commentsListElement.appendChild(name);
            commentsCloseListElement.appendChild(trash);

            commentsList.push(name);
            commentCloseList.push(trash);
            commentNameList.push(name);
        }
    }
    for (let i = 0; i < commentsDataList.length; i++) {
        if(commentsDataList[i].comment == "") commentsDataList[i].comment = "<Comentário Vazio>";
        commentNameList[i].textContent = commentsDataList[i].comment;
        commentsList[i].index = i;
        commentsList[i].addEventListener("mouseover", onCommentMouseOver);
        commentsList[i].addEventListener("mouseout", onCommentMouseOut);
        commentsList[i].addEventListener("click", onCommentClick);
        commentCloseList[i].index = i;
        commentCloseList[i].id = "X" + i;
        commentCloseList[i].addEventListener("click", onCloseCommentButton)
    }
}

function onCommentClick(event){

    console.log("Click");
    var index = event.currentTarget.index;
    editionIndex = index;
    OpenCommentWindow(index);

}
function onCommentMouseOver(event){
    console.log("Over");

    var index = event.currentTarget.index;

    HighlightCommentMarkers(index);
}
function onCommentMouseOut(event){
    console.log("Out");

    var index = event.currentTarget.index;
    ResetHighlightCommentMarkers(index);

}

function HighlightCommentMarkers(index){
    console.log(commentMarkers[index]);
    console.log(commentMarkers);
    commentMarkers[index].material.color = new THREE.Color(commentHightlightColor);
    commentMarkers[index].scale.set(2, 2, 2);
}

function ResetHighlightCommentMarkers(index){
    commentMarkers[index].material.color = new THREE.Color(commentColor);
    commentMarkers[index].scale.set(1, 1, 1);
}
function onCloseCommentButton(event){
    var index = event.currentTarget.index;
    removeCommentElement(index);
}
function removeCommentElement(index){ 
    commentCloseList[index].remove();
    commentNameList[index].remove();
    commentsList[index].remove();
    DeleteMarker(index);
    delete commentNameList[index];
    delete commentCloseList[index];
    delete commentsDataList[index];
    delete commentsList[index];
    var newCloseArray = [];
    var newMeasureArray = [];
    var newNamesArray = [];
    var newMetricsArray = [];
    for (let i = 0; i < commentCloseList.length; i++) {
        if (commentCloseList[i]) {
            newCloseArray.push(commentCloseList[i]);
        }
        if (commentsDataList[i]) {
            newMeasureArray.push(commentsDataList[i]);
        }
        if (commentsList[i]) {
            newMetricsArray.push(commentsList[i]);
        }
        if (commentNameList[i]) {
            newNamesArray.push(commentNameList[i]);
        }
    }
    commentNameList = newNamesArray;
    commentCloseList = newCloseArray;
    commentsDataList = newMeasureArray;
    commentsList = newMetricsArray;

    UpdateCommentsFields();
}

function UpdateMeasureFields() {
    if (!measureListElement) {
        measureListElement = document.getElementById("measureList");
    }
    if (!closeListElement) {
        closeListElement = document.getElementById("closeList");
    }
    var diff = metricsList.length - measureList.length;
    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            var name = document.createElement("div");
            name.className = "name";
            name.contentEditable = true;
            var element = document.createElement("div");
            var trash = document.createElement("div");
            trash.innerHTML = "X";
            trash.style.height = "37px";
            //element.appendChild(trash);
            measureListElement.appendChild(name);
            measureListElement.appendChild(element);
            closeListElement.appendChild(trash);

            measureList.push(element);
            closeList.push(trash);
            measureNameList.push(name);
        }
    }
    for (let i = 0; i < metricsList.length; i++) {
        if(!measureNameList[i].textContent) measureNameList[i].textContent = "Metric " + i;
        measureList[i].textContent = metricsList[i].distance.toFixed(2) + 'cm';
        measureList[i].index = i;
        measureList[i].addEventListener("mouseover", onMeasureMouseOver);
        measureList[i].addEventListener("mouseout", onMeasureMouseOut);
        closeList[i].index = i;
        closeList[i].id = "X" + i;
        closeList[i].addEventListener("click", onCloseMeasureButton)
    }
}
function RemoveElement(index) {
    closeList[index].remove();
    measureNameList[index].remove();
    measureList[index].remove();
    measureList[index].remove();
    scene.remove(metricsList[index].marker1);
    scene.remove(metricsList[index].marker2);
    scene.remove(metricsList[index].line);
    delete measureNameList[index];
    delete closeList[index];
    delete measureList[index];
    delete metricsList[index];
    var newCloseArray = [];
    var newMeasureArray = [];
    var newNamesArray = [];
    var newMetricsArray = [];
    for (let i = 0; i < closeList.length; i++) {
        if (closeList[i]) {
            newCloseArray.push(closeList[i]);
        }
        if (measureList[i]) {
            newMeasureArray.push(measureList[i]);
        }
        if (metricsList[i]) {
            newMetricsArray.push(metricsList[i]);
        }
        if (measureNameList[i]) {
            newNamesArray.push(measureNameList[i]);
        }
    }
    measureNameList = newNamesArray;
    closeList = newCloseArray;
    measureList = newMeasureArray;
    metricsList = newMetricsArray;

    UpdateMeasureFields();
}
function ResetHighlight() {
    for (let i = 0; i < metricsList.length; i++) {

        metricsList[i].marker1.material.color = new THREE.Color(0xffffff);
        metricsList[i].marker2.material.color = new THREE.Color(0xffffff);
        metricsList[i].marker1.scale.set(1, 1, 1);
        metricsList[i].marker2.scale.set(1, 1, 1);
    }
}
function HighlightMarkers(index) {
    for (let i = 0; i < metricsList.length; i++) {

        metricsList[i].marker1.material.color = new THREE.Color(0xffffff);
        metricsList[i].marker2.material.color = new THREE.Color(0xffffff);
        metricsList[i].marker1.scale.set(1, 1, 1);
        metricsList[i].marker2.scale.set(1, 1, 1);


    }
    const highlightScale = 3;
    const highlightColor = 0x00ff00;
    metricsList[index].marker1.material.color = new THREE.Color(highlightColor);
    metricsList[index].marker2.material.color = new THREE.Color(highlightColor);
    metricsList[index].marker1.scale.set(highlightScale, highlightScale, highlightScale);
    metricsList[index].marker2.scale.set(highlightScale, highlightScale, highlightScale);

}
function onCloseMeasureButton(event) {
    var index = event.currentTarget.index;
    RemoveElement(index);
}
function onMeasureMouseOut(event) {
    ResetHighlight();
}
function onMeasureMouseOver(event) {
    var index = event.currentTarget.index;
    HighlightMarkers(index);
}

function OnMouseDown(event) {
    //saves pointer on click
    clickPointer.x = pointer.x;
    clickPointer.y = pointer.y;
}

function onClick(event) {
    if(!window.canClick) return;
    //check if pointer moved less than the threshold
    if (clickPointer && clickPointer.distanceTo(pointer) < limitThreshold) {
        if (refSphere && refSphere.visible) {

            AddPoint(refSphere.position);
            if(rulerAddPoint && canUseRuler){
                if (vertexList.length !== 0 && vertexList.length % 2 == 0) {
                    const v1 = vertexList[vertexList.length - 1];
                    const v2 = vertexList[vertexList.length - 2];
    
                    const m1 = measureMarkers[measureMarkers.length - 1];
                    const m2 = measureMarkers[measureMarkers.length - 2];
                    const line = AddLine(v1, v2);
                    metricsList.push({ distance: v1.distanceTo(v2), point1: v1, marker1: m1, point2: v2, marker2: m2, line: line });
                    UpdateMeasureFields();
                    HideSphere();
                }
            }
            else if (commentAddPoint && canUseComment && !commentAlreadyRunning){
                //TODO Comments Logic
                SaveCommentPosition(refSphere.position);
                InstantiateCommentSphere(refSphere.position);
                OpenCommentWindow();
                HideSphere();

            }
            
        }
    }
}

function SaveCommentPosition(position){
    commentPosition = position;
    //TODO Save position to hold in the list
}

function OpenCommentWindow(index){
    submitComment.style.display = 'inline';
    cancelComment.style.display = 'inline';
    updateComment.style.display = 'none';

    if(index != undefined){
        console.log(commentsDataList[index].comment);
        console.log(commentsDataList[index]);
        commentField.value = commentsDataList[index].comment;
        submitComment.style.display = 'none';
        cancelComment.style.display = 'none';
        updateComment.style.display = 'inline';
    }   

    window.commentWindow.style.display = "inline";
    commentAddPoint = false;
    commentAlreadyRunning = true;
}

function HideCommentWindow(){
    window.commentWindow.style.display = "none";
    commentField.value = "";
    commentAddPoint = true;
    commentAlreadyRunning = false;

}

function DeleteMarker(index){

    if(index == -1) index = commentMarkers.length-1;
    scene.remove(commentMarkers[index]);
}

function SubmitComment(){
    var obj = {comment:commentField.value, position:commentPosition};
    commentsDataList.push(obj);
    UpdateCommentsFields();
    HideCommentWindow()

}

function CancelComment(){
    HideCommentWindow();
    DeleteMarker(-1);
}

function UpdateComment(){
    commentsDataList[editionIndex].comment = commentField.value;
    UpdateCommentsFields();
    HideCommentWindow()
}

function InstantiateCommentSphere(obj){
    const geometry = new THREE.SphereGeometry(markerSize*2, markerHsegments, markerWsegments);
    const material = new THREE.MeshBasicMaterial({ color: commentColor });
    material.depthTest = false;
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(obj.x + (markerSize), obj.y + (markerSize), obj.z + (markerSize));
    sphere.renderOrder = 1;

    commentMarkers.push(sphere);
    scene.add(sphere);
    console.log(commentMarkers);
}
function onExitClick(event) {
    rulerAddPoint = false;
    commentAddPoint = false;
    window.boxBase.style.display = 'none';
    window.boxComments.style.display = 'none';
    window.commentWindow.style.display = 'none';

}

function disableRuler(){
    canUseRuler = false;
}
function enableRuler(){
    canUseRuler = true;
}

function disableComments(){
    canUseComment = false;
}
function enableComments(){
    canUseComment = true;
}


window.resetRuler = function resetRuler(){
    rulerAddPoint = false;
    window.boxBase.style.display = 'none';
}

window.resetComments = function resetComments(){
    commentAddPoint = false;
    commentAlreadyRunning = false;
    window.boxComments.style.display = 'none';
    window.commentWindow.style.display = 'none';
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onClick);
window.addEventListener('mousedown', OnMouseDown);

//Ruler Events
window.boxBase = document.getElementById("boxBase");
window.boxBase.addEventListener("mouseover", disableRuler);
window.boxBase.addEventListener("mouseout", enableRuler);

//Comments Events
window.boxComments = document.getElementById("boxComments");
window.boxComments.addEventListener("mouseover", disableComments);
window.boxComments.addEventListener("mouseout", enableComments);


boxClose = document.getElementById("boxCloseRuler");
boxClose.addEventListener('click', onExitClick);

boxCloseComment = document.getElementById("boxCloseComments");
boxCloseComment.addEventListener('click', onExitClick);
window.commentWindow =  document.getElementById("commentWindow");
commentText = document.getElementById("commentField");
submitComment =  document.getElementById("submitComment");
submitComment.addEventListener('click', SubmitComment);

cancelComment =  document.getElementById("cancelComment");
cancelComment.addEventListener('click', CancelComment);


updateComment = document.getElementById("updateComment");
updateComment.addEventListener('click', UpdateComment);

//window.boxComments.style.display = 'inline';
