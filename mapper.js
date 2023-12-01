async function GetMapperJson(){

    const response = await fetch("./reference-mapper.json"); 
    const json = await response.json();
    return json;
}
function BuildLight(json){

    let lightsRawData = json.lights;

lightsRawData.forEach(element => {
    let light;
    switch(element.type){
        case "point": 
        default :
            light = new THREE.PointLight(element.color);
            break;
        case "spot" : 
            light = new THREE.SpotLight(element.color);
            break;
        case "hemisphere":
            light = new THREE.HemisphereLight(element.color);
            break;
        
    }
    //TODO Verify if it is possible to store the data directly from exporter
    light.position.set(element.position.x,element.position.y,element.position.z)
    light.intensity = element.intensity;
});
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
    return mat; 
}
let jsonData;
let jsonMaterials;
async function InitMapper(){
    jsonData = await GetMapperJson();
    jsonMaterials = jsonData.materials;    
}
