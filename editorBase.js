//Base editor class


class Editor{

    componentsList = [];

    //properties : list with the list of properties
    constructor(properties = []){
        this.componentsList = properties;
    }
}

class Property{
    name;
    type; 
    fields = {};
    constructor(name="new object", type = undefined, fields = {}){
        this.name = name;
        this.type = type;
        this.fields = fields;
    }
}

window.baseWindow = document.getElementById("baseWindow");
window.boxCloseBaseWindow = document.getElementById("boxCloseBaseWindow");

boxCloseBaseWindow.addEventListener('click', onExitClick);

function onExitClick(){
    window.baseWindow.style.display = "none";
}