// #region SETUP

let QUEST_LIST = '';
const TABLE = "Table";
const CELL = "Cell";
const ROW = "Row";
const PATTERN = "_xml.pak";
const TARGET_NAME = "text_ui_quest.xml";

const PAK_INPUT = document.getElementById("pakInput");

function getNewXmlFileName() {
    return `text__${mapManifest.get('fieldModName')}.xml`;
}

function getOutputZipFileName() {
    return `${mapManifest.get('fieldModName')}.zip`;
}

// #endregion

// #region MODELS

class File {
    constructor(fileName, fileData) {
        this.name = fileName;
        this.data = fileData;
    }
}

// #endregion

// #region HELPERS

function getTimestamp(){
    const currentDate = new Date();
    const year = String(currentDate.getFullYear()).padStart(4, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${day}.${month}.${year}`;
}

function minifyXML(xmlString) {
    return xmlString.replace(/\s*(<[^>]+>)\s*/g, "$1").trim();
}

function sanitizeDirectoryName(name) {
    return name.replace(/[\/\\:*<>?"|\s]/g, '');
}

function setStatus(text) {
    console.log(text);
    setStatusMsg(text);
}

function downloadBlob(blob, fileName) {
    // Set status
    setStatus(`The download of the '${fileName}' file should start soon.`)

    // Create a URL representing the Blob object
    const url = URL.createObjectURL(blob);

    // Create an anchor element and set its href attribute
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(a);

    // Trigger a click on the anchor
    a.click();

    // Remove the anchor from the body
    document.body.removeChild(a);

    // Revoke the URL to release memory
    URL.revokeObjectURL(url);
}

function hexStringToUint8Array(hexString) {
    if (hexString.length % 2 !== 0) {
        throw new Error('Hex string must have an even number of characters');
    }
    let array = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        array[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return array;
}

function uint8ArrayToHexString(uint8Array) { 
    return Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase(); 
}

// #endregion

// #region CONFIG

// Default Manifest Configuration
const MANIFEST_CONFIG_NAME = "mapManifest";
var mapManifest0 = new Map();
mapManifest0.set("fieldModName", "MarkTimedQuests");
mapManifest0.set("fieldModDescription", "Marks the quests that have a time limit.");
mapManifest0.set("fieldAuthor", "Mi5hmasH");
mapManifest0.set("fieldModVersion", "1.0");
mapManifest0.set("fieldKCDVersion", "1.9.6");
// Load the default configuration
var mapManifest = mapManifest0;

// Default Quest Configuration
const QUEST_CONFIG_NAME = "mapQuest";
var mapQuest0 = new Map();
mapQuest0.set("fieldQuestIndicator", "[†]");
mapQuest0.set("fieldMarkedQuestList", [
    "subchapter_293_name",
    "subchapter_294_name",
    "subchapter_323_name",
    "subchapter_348_name",
    "subchapter_365_name",
    "subchapter_373_name",
    "subchapter_383_name",
    "subchapter_384_name",
    "subchapter_397_name",
    "subchapter_403_name",
    "subchapter_454_name",
    "subchapter_524_name",
    "subchapter_615_name",
    "subchapter_661_name",
    "subchapter_676_name"
]);
// Load the default configuration
var mapQuest = mapQuest0;

function getMarkedQuestList() {
    return mapQuest.get("fieldMarkedQuestList").split(",");
}

function mapToObject(map) {
    let obj = {};
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}

function objectToMap(obj) {
    let map = new Map();
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            map.set(key, obj[key]);
        }
    }
    return map;
}

// Function that sets config in localStorage
async function setConfig(map, name) {
    let obj = mapToObject(map);
    let data = JSON.stringify(obj);
    await setEncryptedLocalStorageItem(name, data);
}

// Function that gets config from localStorage
async function getConfig(name) {
    let encryptedData = await getEncryptedLocalStorageItem(name);
    if (encryptedData) {
        let obj = JSON.parse(encryptedData);
        return objectToMap(obj);
    }
    return null;
}

// Function that sets input fields according to configuration
function setInputs(map) {
    map.forEach((value, key) => {
        document.getElementById(key).value = value;
    });
}

// Function that collects input fields values into configuration
function getInputs(map) {
    map.forEach((value, key) => {
        let val = document.getElementById(key).value.trim();
        if (val !== null && val !== '') {
            map.set(key, val);
        }
    });
}

function collectInputs(){
    getInputs(mapQuest);
    getInputs(mapManifest);
}

function fixManifestInputs() {
    document.getElementById('fieldModName').value = sanitizeDirectoryName(document.getElementById('fieldModName').value);
}

window.updateQuestIndicatorField = () => {
    var sourceField = document.getElementById("fieldQuestIndicator").value;
    document.getElementById("fieldPreview").value = `${sourceField} Quest Title`;
}

window.saveManifestConfig = async() => {
    fixManifestInputs();
    getInputs(mapManifest);
    await setConfig(mapManifest, MANIFEST_CONFIG_NAME);
}

window.loadManifestConfig = async() => {
    let map = await getConfig(MANIFEST_CONFIG_NAME);
    if (map) mapManifest = map;
    setInputs(mapManifest);
}

window.deleteManifestConfig = async() => {
    removeLocalStorageItem(MANIFEST_CONFIG_NAME);
    mapManifest = mapManifest0;
    setInputs(mapManifest);
}

window.saveQuestConfig = async() => {
    getInputs(mapQuest);
    await setConfig(mapQuest, QUEST_CONFIG_NAME);
}

window.loadQuestConfig = async() => {
    let map = await getConfig(QUEST_CONFIG_NAME);
    if (map) mapQuest = map;
    setInputs(mapQuest);
    updateQuestIndicatorField();
}

window.deleteQuestConfig = async() => {
    removeLocalStorageItem(QUEST_CONFIG_NAME);
    mapQuest = mapQuest0;
    setInputs(mapQuest);
    updateQuestIndicatorField();
}

// #endregion

// #region LOCAL_METHODS

function createManifest() {
    const manifestFileName = "mod.manifest";
    const manifestContent = `<?xml version="1.0" encoding="utf-8"?><kcd_mod><info><name>${mapManifest.get('fieldModName')}</name><description>${mapManifest.get('fieldModDescription')}</description><author>${mapManifest.get('fieldAuthor')}</author><version>${mapManifest.get('fieldModVersion')}</version><created_on>${getTimestamp()}</created_on></info><supports><kcd_version>${mapManifest.get('fieldKCDVersion')}</kcd_version></supports></kcd_mod>`;
    return new File(manifestFileName, manifestContent);
}

function populateQuestTable(map) {
    const tbody = document.querySelector('#questTable tbody');
    tbody.innerHTML = ''; // Clear existing table rows

    let i = 0;
    map.forEach((title, id) => {
        i++;
        const row = document.createElement('tr');
        const numCell = document.createElement('td');
        const titleCell = document.createElement('td');
        const questIdCell = document.createElement('td');
        
        numCell.textContent = i;
        titleCell.textContent = title;
        questIdCell.textContent = id

        row.appendChild(numCell);
        row.appendChild(titleCell);
        row.appendChild(questIdCell);
        tbody.appendChild(row);
    });
}

window.getQuestIDsFromFirstFile = async() => { 
    // Get first file
    const inputFiles = PAK_INPUT.files;
    // Validate PAK files and collect the valid ones
    if (inputFiles.length == 0) return;
    const files = Array.from(inputFiles);
    const validFiles = files.filter(file => file.name.endsWith(PATTERN));
    // Prepare unpacker
    const jszip = new JSZip();
    // Load PAK data
    if (validFiles.length == 0) return;
    const pakData = await validFiles[0].arrayBuffer();
    const pak = await jszip.loadAsync(pakData);
    // Iterate over the files in the PAK archive and find matching one
    let fileContent = "";
    for (const fileName in pak.files) {
    if (fileName != TARGET_NAME) continue;
        fileContent = await pak.files[fileName].async("string");
    }
    if (fileContent === "") return;
    // Parse the XML string into a DOM Document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(fileContent, "application/xml");
    // Get all Row nodes
    const rows = xmlDoc.getElementsByTagName(ROW);
    // Iterate over the Row nodes and find matches
    const questMap = new Map();
    for (let row of rows) {
        let cells = row.getElementsByTagName(CELL);
        if (!cells[0].textContent.endsWith('_name')) continue;
        questMap.set(cells[0].textContent, cells[cells.length - 1].textContent)
    }
    populateQuestTable(questMap);
}

async function getFilesFromPaks() {
    // Get first file
    const inputFiles = PAK_INPUT.files;

    // Set result
    setStatus("Processing...");

    // Validate PAK files and collect the valid ones
    if (inputFiles.length == 0) {
        setStatus("Please select a PAK file first.");
        return;
    }
    const files = Array.from(inputFiles);
    const validFiles = files.filter(file => file.name.endsWith(PATTERN));

    // Prepare unpacker
    const jszip = new JSZip();

    // Iterate over the validFiles
    let i = 0;
    const pakFiles = [];
    for (let file of validFiles) {
        // Update status
        i++;
        setStatus(`[${i}/${validFiles.length}] Processing '${file.name}'.`);

        // Load PAK data
        const pakData = await file.arrayBuffer();
        const pak = await jszip.loadAsync(pakData);

        // Iterate over the files in the PAK archive and find matching one
        let fileContent = "";
        for (const fileName in pak.files) {
        if (fileName != TARGET_NAME) continue;
            fileContent = await pak.files[fileName].async("string");
        }

        if (fileContent === "") continue;
        
        // Process the file content and collect the result
        fileContent = processXML(fileContent);
        pakFiles.push(new File(file.name, fileContent));
    }

    return pakFiles;
} 

function processXML(xmlString) {
    // Parse the XML string into a DOM Document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Get all Row nodes
    const rows = xmlDoc.getElementsByTagName(ROW);

    // Iterate over the Row nodes and find matches
    const matchingRows = [];
    for (let row of rows) {
        const firstCell = row.getElementsByTagName(CELL)[0];
        if (firstCell && QUEST_LIST.includes(firstCell.textContent)) {
            matchingRows.push(row.cloneNode(true));
        }
    }

    // Iterate over the Row nodes and modify last cells
    for (let row of matchingRows) {
        const cells = row.getElementsByTagName(CELL);
        const lastCell = cells[cells.length - 1];
        lastCell.textContent = `${mapQuest.get("fieldQuestIndicator")} ${lastCell.textContent}`
    }

    // Create an empty XML document
    const newXmlDoc = document.implementation.createDocument(null, null);
    
    // Append matching rows to the root
    const root = newXmlDoc.createElement(TABLE); 
    for (let row of matchingRows) {
        root.appendChild(row);
    }

    // Add the root node to the new xml document
    newXmlDoc.appendChild(root);

    // Serialize the new XML document
    const serializer = new XMLSerializer();
    const serializedXML = serializer.serializeToString(newXmlDoc);
    
    // Minify the XML string
    return minifyXML(serializedXML);
}

async function packZip(files) {
    // Pack PAK files
    const jszip = new JSZip();
    const root = mapManifest.get('fieldModName');
    for (const file of files) {
        const jspak = new JSZip();
        jspak.file(getNewXmlFileName(), file.data);
        const pakUint8Array = await jspak.generateAsync({
            type: "Uint8Array",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });
        jszip.folder(`${root}/Localization`).file(file.name, pakUint8Array);
    }
    // Create manifest file and include it
    const manifest = createManifest();
    jszip.file(`${root}/${manifest.name}`, manifest.data);

    return await jszip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    });
}

// #endregion

// #region PUBLIC_METHODS

window.validatePaks = (e) => {
    const input = e.target;
    const files = Array.from(input.files);
    const validFiles = files.filter(file => file.name.endsWith(PATTERN));

    if (validFiles.length < files.length) {
        console.log('Some files were not valid and have been excluded.');
    }

    // Create a new DataTransfer object to update the input with only valid files
    const dataTransfer = new DataTransfer();
    validFiles.forEach(file => dataTransfer.items.add(file));

    // Update the input's files property with the valid files
    input.files = dataTransfer.files;

    // Change disabled status of related buttons
    let test = (input.files.length < 1);
    const fields = ['runButton', 'loadQuestIDsFromFirstFile'];
    for (let field of fields) {
        document.getElementById(field).disabled = test;
    }
};

window.insertCharacter = (buttonElement) => {
    let character = buttonElement.textContent.trim();
    let target = document.getElementById('fieldQuestIndicator');
    if (target.value.length > target.getAttribute('maxlength')) return;
    target.value += character;
    updateQuestIndicatorField();
}

window.prepareMod = async() => {
    setBusyState(true);
    collectInputs();
    QUEST_LIST = getMarkedQuestList();
    QUEST_LIST.sort();
    const newPakFiles = await getFilesFromPaks();
    const zipBlob = await packZip(newPakFiles);
    downloadBlob(zipBlob, getOutputZipFileName());
    setBusyState(false);
}

// #endregion