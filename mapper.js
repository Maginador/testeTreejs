async function GetMapperJson() {

    const response = await fetch("./reference-mapper.json");
    const json = await response.json();
    return json;
}
const loader = new THREE.TextureLoader();

function ValidatePattern(pattern, src) {
    var result = false;
    if ((pattern.prefix.toLowerCase() && src.startsWith(pattern.prefix)) ||
        (pattern.sufix.toLowerCase() && src.endsWith(pattern.sufix)) ||
        (pattern.contains.toLowerCase() && src.includes(pattern.contains)) ||
        (pattern.equals.toLowerCase() && src === pattern.equals)) {
        result = true;
    }

    return result;
}
async function MapLightsMaterials(src) {
    for (let i = 0; i < jsonLights.length; i++) {
        if (ValidatePattern(jsonLights[i].pattern, src)) {
            return jsonLights[i]
        }
    }
    return null;
}

async function MapLights(src, position) {
    for (let i = 0; i < jsonMaterials.length; i++) {
        if (ValidatePattern(jsonMaterials[i].pattern, src)) {
            light = await BuildLight(jsonMaterials[i], position);
        }
    }
    return light;
}

async function MapMaterial(src) {

    let mat = BuildDefaultMaterial();
    for (let i = 0; i < jsonMaterials.length; i++) {
        if (ValidatePattern(jsonMaterials[i].pattern, src)) {
            mat = await BuildMaterial(jsonMaterials[i]);
        }
    }
    return mat;

}

function BuildDefaultMaterial() {
    const mat = new THREE.MeshStandardMaterial();
    //in case of any specification for default materials, it can be added here

    return mat;
}

async function BuildLight(lightData, position) {
    let light;
    switch (lightData.type) {
        case "point":
        default:
            light = new THREE.PointLight(lightData.color);
            break;
        case "spot":
            light = new THREE.SpotLight(lightData.color);
            break;
        case "hemisphere":
            light = new THREE.HemisphereLight(lightData.color);
            break;

    }

    light.position.set(position.x, position.y, position.z);
    light.angle = Math.PI / lightData.angle;
    const targetObject = new THREE.Object3D();
    targetObject.position.set(position.x + lightData.targetoffset.x, position.y + lightData.targetoffset.y, position.z + lightData.targetoffset.z);
    scene.add(targetObject);
    light.target = targetObject;
    light.intensity = lightData.intensity;

    return light;
}
async function BuildMaterial(material) {

    let mat = new THREE.MeshStandardMaterial();
    if (material.videotexture) {
        let video = document.getElementById('video');
        video.src = "./" + material.videosource;
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        mat.map = texture;
    }

    //PBR parameters
    mat.bloom = material.bloom;

    //maps
    mat = await ProcessMaps(mat, material);

    //properties
    mat = ProcessProperties(mat, material);
    if (material.removemesh) mat.opacity = 0;

    mat.needsUpdate = true;

    return mat;
}
let jsonData;
let jsonMaterials;
let jsonLights;

function ProcessProperties(mat, material) {
    if (material.aomapintensity) mat.aoMapIntensity = parseFloat(material.aomapintensity);
    if (material.bumpscale) mat.bumpScale = parseFloat(material.bumpscale);
    if (material.displacementscale) mat.displacementScale = parseFloat(material.displacementscale);
    if (material.emissioncolor) mat.emissive = new THREE.Color(material.emissioncolor);
    if (material.emissionintensity) mat.emissiveIntensity = parseFloat(material.emissionintensity);
    if (material.envmapintensity) mat.envMapIntensity = parseFloat(material.envmapintensity);
    if (material.lightmapintensity) mat.lightMapIntensity = parseFloat(material.lightmapintensity);
    if (material.metalness) mat.metalness = parseFloat(material.metalness);
    if (material.roughness) mat.roughness = parseFloat(material.roughness);
    return mat;
}
async function ProcessMaps(mat, material) {

    if (material.bumpmap) {
        var texture = await loader.load(material.bumpmap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.bumpMap = texture;
    }
    if (material.normalmap) {
        var texture = await loader.load(material.normalmap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.normalMap = texture;
    }

    if (material.aomap) {
        var texture = await loader.load(material.aomap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.aoMap = texture;
    }

    if (material.alphamap) {
        var texture = await loader.load(material.alphamap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.alphaMap = texture;
    }
    if (material.displacementmap) {
        var texture = await loader.load(material.displacementmap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.displacementMap = texture;
    }
    if (material.emissivemap) {
        var texture = await loader.load(material.emissivemap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.emissiveMap = texture;
    }
    if (material.envmap) {

        var texture = await loader.load(material.envmap);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.envMap = texture;
    }
    if (material.lightmap) {
        var texture = await loader.load(material.lightmap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.lightMap = texture;
    }
    if (material.metalnessmap) {
        var texture = await loader.load(material.metalnessmap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.metalnessMap = texture;
    }
    if (material.roughnessmap) {
        var texture = await loader.load(material.roughnessmap);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1,1);
        mat.roughnessMap = texture;
    }
    return mat;
}
async function InitMapper() {
    jsonData = await GetMapperJson();
    jsonMaterials = jsonData.materials;
    jsonLights = jsonData.lights;
}
