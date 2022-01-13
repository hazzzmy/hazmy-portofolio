const fs = require('fs');

//Memeriksa Folder
const dirPath = './data';
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

//Memeriksa File contacts.json
const dataPath ='./data/basemaps-providers.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath,'[]','utf-8');
}

const loadProviders = ()=>{
    const file = fs.readFileSync('./data/basemaps-providers.json','utf-8');
    const providers =JSON.parse(file);

    return providers;
}

const findProvider = (name)=>{
    const providers = loadProviders();
    const provider = providers.find((provider)=> provider.name.toLowerCase() === name.toLowerCase());
    return provider;
};

module.exports ={ loadProviders, findProvider};
// ######################################################################
