class MaterialEditor extends Editor{

    setListOfMaterials(materials){
        for(var i = 0; i<materials.length; i++){
            var fields = {};
            fields.materialInstance = materials[i];
            var prop = new Property("material", "material", fields);
            this.componentsList.push(prop);
        }
        console.log(this.componentsList);
    }
    
}