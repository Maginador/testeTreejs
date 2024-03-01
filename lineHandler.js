import * as THREE from 'three';
import { Line2 } from '/jsm/lines/Line2.js';
import { LineMaterial } from '/jsm/lines/LineMaterial.js';
import { LineGeometry } from '/jsm/lines/LineGeometry.js';


const lineMaterial = new LineMaterial({

    color: 0xffffff,
    linewidth: .002, // in world units with size attenuation, pixels otherwise
    vertexColors: true,
    dashed: false
});
window.getLineMaterial = function GetLineMaterial() {
    return lineMaterial;
}

window.generateLineGeometry = function generateLineGeometry(){
    return new LineGeometry();

}
window.generateLine2 = function generateLine2(geometry, material){
    return new Line2(geometry, material);
}