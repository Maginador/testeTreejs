import * as THREE from 'three';
import { SimplifyModifier } from '/jsm/modifiers/SimplifyModifier.js';
import {BufferGeometryUtils} from '/jsm/utils/BufferGeometryUtils.js';

const modifier = new SimplifyModifier();


window.mergeVertices = function mergeVertices(bufferGeometry){
    return BufferGeometryUtils.mergeVertices(bufferGeometry,0);
}
window.mergeGeometry = function mergeGeometry(geometries,useGroups){
    const result = BufferGeometryUtils.mergeBufferGeometries(geometries,useGroups);
    return result;
}
window.simplifyScene = function simplifyScene(objectsRoot, percentage){
   
    console.log("1");
    var rootObj = new THREE.Object3D();
    console.log("2");

    const simplified = objectsRoot.clone();
    console.log("3");
    console.log(simplified)
    base = simplified.geometry.attributes.position.count;

    const count = Math.floor( base * percentage ); // number of vertices to remove
    console.log(count);

    simplified.geometry = modifier.modify( simplified.geometry, count );
    console.log(simplified.geometry);
    simplified.material = objectsRoot.material;
    rootObj.add(simplified);
    console.log(rootObj.children.length)
    console.log(objectsRoot.material)
    return rootObj;
    console.log("teste");
    var children = objectsRoot.children;
    console.log(children)
    var rootObj = new THREE.Object3D();;
    for(let i =0; i< children.length; i++){

        if(children[i].isMesh){
            const simplified = children[i].clone();
            var base = 0;
            if(simplified.geometry.vertices){
                base = simplified.geometry.vertices.length;
            }else if (simplified.geometry.attributes.position) { 
                base = simplified.geometry.attributes.position.count;
            }else{
                console.log("Missing vertices data for object : ");
                console.log(simplified);
                continue;

            }
            const count = Math.floor( base * percentage ); // number of vertices to remove
            simplified.geometry = modifier.modify( simplified.geometry, count );
            console.log(simplified.geometry);
            simplified.material = children[i].material;
            rootObj.add(simplified);
            console.log(rootObj.children.length)
            console.log(children[i].material)

        }
        
    }
    return rootObj;
}
