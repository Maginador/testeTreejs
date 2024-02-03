class LightEditor extends Editor{

    setListOfLights(lights){
        for(var i = 0; i<lights.length; i++){
            var fields = {};
            fields.color = lights[i].color;
            fields.position = lights[i].position;
            var prop = new Property("light", "light", fields);
            this.componentsList.push(prop);
        }
        console.log(this.componentsList);
    }
    
}