//This class is responsible for mapping dynamically textures 

let materials = [];
let patterns = [];
let dynamicJson;
function getReference(src){
    console.log(dynamicJson);
    return ValidatePattern(dynamicJson.pattern, src)
}

function updateReference(index){
    
}

function setJson(json){
    dynamicJson = json;
}