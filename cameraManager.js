let perspectiveCamera;
let orthographicCamera;


let perpectiveTransforms = [];
let orthographicTransforms = [];
const PERSPECTIVE_CAMERA = 1;
const ORTHOGRAPHIC_CAMERA = 2;

const frustumSize = 50;

let currentCamera = 0;
const PI = 3.14;

function toggleCamera(){
    if(currentCamera === PERSPECTIVE_CAMERA){
        setCurrentCamera(ORTHOGRAPHIC_CAMERA);
    }else if(currentCamera === ORTHOGRAPHIC_CAMERA){
        setCurrentCamera(PERSPECTIVE_CAMERA);
    }
}
function anglesToRad(angles){
    return angles * PI / 180;
}
function vectorToEuler(vector){
    var euler = new THREE.Euler(anglesToRad(vector.x),anglesToRad(vector.y),anglesToRad(vector.z), "XYZ");
    console.log(euler);
    return euler;
}

function setPerspectiveTransformation(position, rotation){
    var transformation = {position:position, rotation:rotation};
    perpectiveTransforms.push(transformation); 
}

function setOrthographicTransformation(position, rotation, useTransform){
    console.log(position);
    console.log(rotation);
    var transformation = {position:position, rotation:rotation};
    orthographicTransforms.push(transformation); 
    if(useTransform)    updateTransform(ORTHOGRAPHIC_CAMERA, orthographicTransforms.length-1);
}

function updateTransform(camera, index){
    console.log(index);
    if(camera === PERSPECTIVE_CAMERA){
        console.log(perpectiveTransforms);
        var pos = perpectiveTransforms[index].position;
        perspectiveCamera.position.set(pos.x, pos.y, pos.z);
        var rot = vectorToEuler(perpectiveTransforms[index].rotation);
        perspectiveCamera.rotation.set(rot.x,rot.y,rot.z);

    }else if(camera === ORTHOGRAPHIC_CAMERA){
        console.log(orthographicTransforms);
        var pos = orthographicTransforms[index].position;
        orthographicCamera.position.set(pos.x, pos.y, pos.z);
        var rot = vectorToEuler(orthographicTransforms[index].rotation);
        orthographicCamera.rotation.set(rot.x,rot.y,rot.z);
    }
}

function instantiatePerspectiveCamera(aspect) {
    perspectiveCamera = new THREE.PerspectiveCamera(50, aspect, 10, scene_length);
    scene.add(perspectiveCamera);
}

function instantiateOrthographicCamera(width, height) {
    orthographicCamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    orthographicCamera.rotation.set(anglesToRad(90),0,0);
    scene.add(orthographicCamera);
    return orthographicCamera;
}

function getOrthoCamera() {
    return orthographicCamera;
}

function getPerspectiveCamera() {
    return perspectiveCamera;
}

function getCurrentCamera(){
    if(currentCamera === ORTHOGRAPHIC_CAMERA){
        return orthographicCamera;
    }else if(currentCamera === PERSPECTIVE_CAMERA){
        return perspectiveCamera;
    }
}
function updateCameras(width, height){

    if(perspectiveCamera){
        perspectiveCamera.aspect = width / height;
        perspectiveCamera.updateProjectionMatrix();
    }
    if(orthographicCamera){
        orthographicCamera.aspect = width / height;
        orthographicCamera.updateProjectionMatrix();
        orthographicCamera.left = - frustumSize * aspect / 2;
        orthographicCamera.right = frustumSize * aspect / 2;
        orthographicCamera.top = frustumSize / 2;
        orthographicCamera.bottom = - frustumSize / 2;
    }
}

function setCurrentCamera(camera){
    if(camera === currentCamera) return;
    
    currentCamera = camera;

}
