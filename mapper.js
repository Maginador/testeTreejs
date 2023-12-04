async function GetMapperJson(){

    const response = await fetch("./reference-mapper.json"); 
    const json = await response.json();
    return json;
}

async function MapLightsMaterials(src){
    for(let i = 0; i<jsonLights.length; i++){
        if(src.startsWith(jsonLights[i].pattern.prefix) || 
        src.endsWith(jsonLights[i].pattern.sufix) || 
        src.includes(jsonLights[i].pattern.contains) ||
        src === jsonLights[i].pattern.equals){
            return jsonLights[i]
        }  
    }
    return null;
}

async function MapLights(src, position){
    for(let i = 0; i<jsonMaterials.length; i++){
        if(src.startsWith(jsonMaterials[i].pattern.prefix) || 
        src.endsWith(jsonMaterials[i].pattern.sufix) || 
        src.includes(jsonMaterials[i].pattern.contains) ||
        src === jsonMaterials[i].pattern.equals){
            light = await BuildLight(jsonMaterials[i], position);
        }  
    }
    return light;
}

async function MapMaterial(src){

    let mat = BuildDefaultMaterial();
    for(let i = 0; i<jsonMaterials.length; i++){
        if(src.startsWith(jsonMaterials[i].pattern.prefix) || 
        src.endsWith(jsonMaterials[i].pattern.sufix) || 
        src.includes(jsonMaterials[i].pattern.contains) ||
        src === jsonMaterials[i].pattern.equals){
            mat = await BuildMaterial(jsonMaterials[i]);
        }  
    }
    return mat;

}

function BuildDefaultMaterial(){
    const mat =  new THREE.MeshStandardMaterial();
    //in case of any specification for default materials, it can be added here

    return mat;
}

async function BuildLight(lightData, position){
    let light;
    switch(lightData.type){
        case "point": 
        default :
            light = new THREE.PointLight(lightData.color);
            break;
        case "spot" : 
            light = new THREE.SpotLight(lightData.color);
            break;
        case "hemisphere":
            light = new THREE.HemisphereLight(lightData.color);
            break;
        
    }
    //TODO Verify if it is possible to store the data directly from exporter
    light.position.set(position.x,position.y,position.z);
    light.angle = Math.PI/lightData.angle ;
    const targetObject = new THREE.Object3D(); 
    targetObject.position.set (position.x+lightData.targetoffset.x, position.y+lightData.targetoffset.y, position.z+lightData.targetoffset.z);
    
    scene.add(targetObject); 
    
    light.target = targetObject;
    light.intensity = lightData.intensity;

    return light;
}
async function BuildMaterial(material){
    let mat = new THREE.MeshStandardMaterial();
    mat.emissive = new THREE.Color(material.emissioncolor);
    mat.emissiveIntensity = parseFloat(material.emissionintensity);
    if(material.videotexture){
        let video = document.getElementById( 'video' );
        video.src = "./" + material.videosource;
        const texture = new THREE.VideoTexture( video );
        texture.colorSpace = THREE.SRGBColorSpace;
        mat.map = texture;
    }
    mat.bloom = material.bloom;
    if(material.removemesh) mat.opacity = 0;
    return mat; 
}
let jsonData;
let jsonMaterials;
let jsonLights;

async function InitMapper(){
    jsonData = await GetMapperJson();
    jsonMaterials = jsonData.materials; 
    jsonLights = jsonData.lights;   
}
