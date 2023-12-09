import * as THREE from 'three';
import { TextGeometry } from '/jsm/geometries/TextGeometry.js';
import { FontLoader } from '/jsm/loaders/FontLoader.js';

let vertexList = [];
let linesList = [];
let metricsList = [];
const markerSize = 2;
const markerHsegments = 12;
const markerWsegments = 12;

let refSphere;
function PickRulerPoint(objects){

    let dist = 99999;
    let index = -1;
    for(let i =0; i<objects.length; i++){
        if(dist > objects[i].distance){
            dist = objects[i].distance;
            index = i;
        }   
    }    

    //constants 
    if(!objects[index])
        return null;
    else {
        return objects[index].point;
    }
        
   
}

function AddLine(v1, v2){ 

    const material = new THREE.LineBasicMaterial( { color: 0xff00 } );
    const points = [];
    points.push(v1);
    points.push(v2);
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    material.depthTest = false;
    const line = new THREE.Line( geometry, material );
    line.renderOrder = 1;
    scene.add(line);
    return line;
}

function HideSphere(){
    if(refSphere) refSphere.visible = false;
}

function MovePoint(point){
    if(!refSphere){
        const geometry = new THREE.SphereGeometry( markerSize, markerHsegments, markerWsegments ); 
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
        material.depthTest = false;
        const sphere = new THREE.Mesh( geometry, material ); 
    
        sphere.position.set(point.x+(markerSize/2), point.y+(markerSize/2), point.z+(markerSize/2));
        sphere.renderOrder = 1;

        scene.add( sphere );
        refSphere = sphere;
    }

    refSphere.visible = true;
    refSphere.position.set(point.x,point.y, point.z);
}
function AddPoint(point){
    
    
    const geometry = new THREE.SphereGeometry( markerSize, markerHsegments, markerWsegments ); 
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
    material.depthTest = false;
    const sphere = new THREE.Mesh( geometry, material ); 
    
    sphere.position.set(point.x+(markerSize/2), point.y+(markerSize/2), point.z+(markerSize/2));
    sphere.renderOrder = 1;

    scene.add( sphere );
    vertexList.push(sphere.position);
    
}

function AddMetrics(p1,p2){
    const loader = new FontLoader();

loader.load( 'fonts/Arial_Regular.json', function ( font ) {

    const material = new THREE.MeshPhongMaterial( { color: 0xffff00 } ); 
    material.depthTest = false;
    var dist = p1.distanceTo(p2);
	const geometry = new TextGeometry( dist.toString(), {
		font: font,
		size: 20,
		height: 5,
		curveSegments: 30,
		bevelEnabled: true,
		bevelThickness: 4,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
    const text = new THREE.Mesh( geometry, material ); 
    text.position.set (p1.x, p1.y, p1.z);
    text.renderOrder = 1;

    scene.add(text);

} );

}

window.RulerRaycast = function RulerRaycast(camera, scene){

    raycaster.setFromCamera( pointer, camera );
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( window.sceneObjects);

    const point = PickRulerPoint(intersects);
    if(!point) {
        HideSphere();
        return;
    }
    MovePoint(point);
    
    
    if(vertexList.length !== 0 && vertexList.length%2 == 0){
        const v1 = vertexList[vertexList.length-1];
        const v2 = vertexList[vertexList.length-2];
        linesList.push(AddLine(v1, v2));
        //metricsList.push(AddMetrics(v1, v2));
        rulerAddPoint = false;
        HideSphere();
    }

}
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clickPointer = new THREE.Vector2();
const limitThreshold = 0.1;
function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function OnMouseDown(event){
    //saves pointer on click
    clickPointer.x = pointer.x;
    clickPointer.y = pointer.y;
    console.log("mouse down");
}

function OnMouseUp(event){
    console.log("mouse up");
    console.log(clickPointer.distanceTo(pointer));
    console.log(clickPointer);
    console.log(pointer);
    //check if pointer moved less than the threshold
    if(clickPointer && clickPointer.distanceTo(pointer) < limitThreshold){ 
        if(refSphere)AddPoint(refSphere.position);
    }
}
window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'click', OnMouseUp );
window.addEventListener( 'mousedown', OnMouseDown );

