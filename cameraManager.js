let perspectiveCamera;
let orthographicCamera;


let perpectiveTransforms = [];
let orthographicTransforms = [];
const PERSPECTIVE_CAMERA = 1;
const ORTHOGRAPHIC_CAMERA = 2;

var frustumSize = 365*2;

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
    return euler;
}

function setPerspectiveTransformation(position, rotation, useTransform){
    console.log(position);
    console.log(rotation);
    var transformation = {position:position, rotation:rotation};
    perpectiveTransforms.push(transformation); 
    if(useTransform)    updateTransform(PERSPECTIVE_CAMERA, perpectiveTransforms.length-1);

}

function setOrthographicTransformation(position, rotation, useTransform){
    console.log(position);
    console.log(rotation);
    var transformation = {position:position, rotation:rotation};
    console.log(transformation);

    orthographicTransforms.push(transformation); 
    if(useTransform)    updateTransform(ORTHOGRAPHIC_CAMERA, orthographicTransforms.length-1);
}

function updateTransform(camera, index){
    if(camera === PERSPECTIVE_CAMERA){
        console.log(perpectiveTransforms);
        var pos = perpectiveTransforms[index].position;
        perspectiveCamera.position.set(pos.x, pos.y, pos.z);
        var rot = vectorToEuler(perpectiveTransforms[index].rotation);
        perspectiveCamera.rotation.set(rot.x,rot.y,rot.z);
        perspectiveCamera.updateProjectionMatrix();


    }else if(camera === ORTHOGRAPHIC_CAMERA){
        console.log(orthographicTransforms);
        var pos = orthographicTransforms[index].position;
        orthographicCamera.position.set(pos.x, pos.y, pos.z);
        var rot = vectorToEuler(orthographicTransforms[index].rotation);
        orthographicCamera.rotation.set(rot.x,rot.y,rot.z);
        orthographicCamera.near = orthographicCamera.position.distanceTo(new THREE.Vector3(0,190,0)); // define the cut point at 1.9m from the floor
        console.log(orthographicCamera.near);
        orthographicCamera.updateProjectionMatrix();
    
    }
}

function instantiatePerspectiveCamera(aspect) {
    perspectiveCamera = new THREE.PerspectiveCamera(50, aspect, 10, scene_length);
    var transform = getDefaultPerspectiveCameraTransform();
    console.log("perspective");
    console.log(transform);
    setPerspectiveTransformation(new THREE.Vector3(transform.position.x,transform.position.y,transform.position.z),
     new THREE.Vector3(transform.rotation.x,transform.rotation.y,transform.rotation.z),true); 
     //Rotation will have no effect as at the moment Orbitcontrols are overriding it
    scene.add(perspectiveCamera);
}

function instantiateOrthographicCamera(width, height) {
    orthographicCamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    orthographicCamera.rotation.set(anglesToRad(90),0,0);
    var transform = getDefaultOrthographicCameraTransform();
    
    console.log("ortho");
    console.log(transform);

    setOrthographicTransformation(new THREE.Vector3(transform.position.x,transform.position.y,transform.position.z),
    new THREE.Vector3(transform.rotation.x,transform.rotation.y,transform.rotation.z),true);
    scene.add(orthographicCamera);
    return orthographicCamera;
}

function getOrthoCamera() {
    return orthographicCamera;
}

function getPerspectiveCamera() {
    return perspectiveCamera;
}

function getCurrentCameraID(){
    return currentCamera;
}

function getCamera(camera){
    if(camera === ORTHOGRAPHIC_CAMERA){
        return orthographicCamera;
    }else if(camera === PERSPECTIVE_CAMERA){
        return perspectiveCamera;
    }
}
function getCurrentCamera(){
    if(currentCamera === ORTHOGRAPHIC_CAMERA){
        return orthographicCamera;
    }else if(currentCamera === PERSPECTIVE_CAMERA){
        return perspectiveCamera;
    }
}
function updateCameras(width, height){

    var aspect = width/height;
    if(perspectiveCamera){
        perspectiveCamera.aspect = aspect;
        perspectiveCamera.updateProjectionMatrix();
    }
    if(orthographicCamera){
        orthographicCamera.aspect = aspect;
        orthographicCamera.left = - frustumSize * aspect / 2;
        orthographicCamera.right = frustumSize * aspect / 2;
        orthographicCamera.top = frustumSize / 2;
        orthographicCamera.bottom = - frustumSize / 2;
        orthographicCamera.updateProjectionMatrix();

    }
}

function setCurrentCamera(camera){
    if(camera === currentCamera) return;
    
    currentCamera = camera;

}
