function GetMapperJson(){

    fetch("./reference-mapper.json") 
    .then((res) => { 
    return res.json(); 
}) 
.then((data) => console.log(data)); 
}

function BuildMaterials(){
//TODO Build List of Materials jsonData.materials[];
}

function BuildLights(){
//TODO Build List of Lights jsonData.lights[];

}

function MapMaterial(src){

//TODO return material based on json specifications jsonData.models[].pattern

//TODO return material if pattern is found jsonData.models[].material-name 
}
let jsonData = GetMapperJson();

//TODO List Material Templates 

//