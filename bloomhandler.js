
import * as THREE from 'three';
import { EffectComposer } from '/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '/jsm/postprocessing/UnrealBloomPass.js';
//import { OutputPass } from '/jsm/postprocessing/OutputPass.js';
const BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const materials = {};



window.ApplyBloom = function ApplyBloom(scene, renderer) {
    window.orthoBloomComposer = new EffectComposer(renderer);
    window.orthoFinalComposer = new EffectComposer(renderer);
    window.perspectiveBloomComposer = new EffectComposer(renderer);
    window.perspFinalComposer = new EffectComposer(renderer);
    //Bloom parameters
    const params = {
        threshold: 0.01, //filtro de branco
        strength: 1, // Intensidade
        radius: 0.2, // tamanho 
        exposure: 1 // quantidade de claridade
    };

    const orthoRenderScene = new RenderPass(scene, getCamera(ORTHOGRAPHIC_CAMERA));
    const perspRenderScene = new RenderPass(scene, getCamera(PERSPECTIVE_CAMERA));

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    window.perspectiveBloomComposer.renderToScreen = false;
    window.perspectiveBloomComposer.addPass(perspRenderScene);
    window.perspectiveBloomComposer.addPass(bloomPass);

    const perspMixPass = new ShaderPass(
        new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: window.perspectiveBloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById('bloom-vertexshader').textContent,
            fragmentShader: document.getElementById('bloom-fragmentshader').textContent,
            defines: {}
        }), 'baseTexture'
    );
    perspMixPass.needsSwap = true;

    window.orthoBloomComposer.renderToScreen = false;
    window.orthoBloomComposer.addPass(orthoRenderScene);
    window.orthoBloomComposer.addPass(bloomPass);

    const orthoMixPass = new ShaderPass(
        new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: window.orthoBloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById('bloom-vertexshader').textContent,
            fragmentShader: document.getElementById('bloom-fragmentshader').textContent,
            defines: {}
        }), 'baseTexture'
    );
    orthoMixPass.needsSwap = true;

    //const outputPass = new OutputPass();

    window.orthoFinalComposer.addPass(orthoRenderScene);
    window.orthoFinalComposer.addPass(orthoMixPass);
    window.perspFinalComposer.addPass(perspRenderScene);
    window.perspFinalComposer.addPass(perspMixPass);
    //window.finalComposer.addPass( outputPass );

}

window.doRender = function doRender() {
    if (window.orthoBloomComposer && window.perspectiveBloomComposer) {

        if (getCurrentCameraID() === ORTHOGRAPHIC_CAMERA) {
            scene.traverse(window.darkenNonBloomed);
            scene.background = new THREE.Color(0x000000);
            window.orthoBloomComposer.render();
            scene.traverse(window.restoreMaterial);
            scene.background = new THREE.Color(0xffffff);
            window.orthoFinalComposer.render();

        } else {

            scene.traverse(window.darkenNonBloomed);
            scene.background = new THREE.Color(0x000000);
            window.perspectiveBloomComposer.render();
            scene.traverse(window.restoreMaterial);
            scene.background = new THREE.Color(0xffffff);
            window.perspFinalComposer.render();
        }

    }
}
window.darkenNonBloomed = function darkenNonBloomed(obj) {
    if (obj.isMesh) {
        if (obj.material.length > 1) {
            materials[obj.uuid] = obj.material;
            obj.material = materialsPBRDark;
        } else {
            materials[obj.uuid] = obj.material;
            obj.material = darkMaterial;
        }
    }
}

window.restoreMaterial = function restoreMaterial(obj) {

    if (materials[obj.uuid]) {

        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
    }
}