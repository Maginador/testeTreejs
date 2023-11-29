function PickClosestVertex(objects){

    let dist = 99999;
    let index = -1;
    for(let i =0; i<objects.length; i++){
        if(dist > objects[i].distance){
            dist = objects[i].distance;
            index = i;
        }   
    }    

   
    console.log (objects[index]);
    console.log (index);
    console.log (objects[0].point);
    console.log (objects[index].point);
    //constants 
    const markerSize = 5;
    const markerHsegments = 12;
    const markerWsegments = 12;
    const point = objects[index].point;
    const geometry = new THREE.SphereGeometry( markerSize, markerHsegments, markerWsegments ); 
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
    const sphere = new THREE.Mesh( geometry, material ); 
    
    
    sphere.position.set(point.x+(markerSize/2), point.y+(markerSize/2), point.z+(markerSize/2));
    
    scene.add( sphere );

    //TODO pick the closest vertex 

    //TODO store and highlight vertex picked 

    //TODO if two vertex are picked, draw a line 

}

function RulerRaycast(camera, scene){

    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
    
    console.log(intersects);

    PickClosestVertex(intersects);

}
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
window.addEventListener( 'pointermove', onPointerMove );

