
const startButton = document.getElementById("start");
const disconnectButton = document.getElementById("disconnect");
const output = document.getElementById("output");
const onOff = document.getElementById("onoff");
const redEl = document.getElementById("red");
const greenEl = document.getElementById("green");
const blueEl = document.getElementById("blue");
const whiteEl = document.getElementById("white");

startButton.addEventListener('click', connectToLedStrip);

async function connectToLedStrip() {
    try {
        log('Requesting device named "L7161"...');
        const device = await navigator.bluetooth.requestDevice(
            {
                filters: [{
                  name: 'L7161'
                }],
                optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] // Required to access service later.
            });
    
        log('Connecting to GATT Server...');
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
        const characteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');

        startButton.style.display = "none";
        disconnectButton.style.display = "inline";
        onOff.style.display = "inline";
        redEl.style.display = "inline";
        greenEl.style.display = "inline";
        blueEl.style.display = "inline";
        whiteEl.style.display = "inline";
        let isOn = true;

        onOff.addEventListener('click', async (e) => {
            log(`Turning LED ${isOn ? "On":"Off"}`);
            const ledCommand = new Uint8Array([0x55, 0x01, 0x02, isOn ? 0x01 : 0x00]);
            isOn = !isOn;
            await characteristic.writeValue(ledCommand);
        });
        onOff.click(); // Trigger to make sure LED is on

        redEl.addEventListener('click', async (e) => {
            log("Turning LED red");
            setRgb(characteristic, 0xff, 0x0, 0x0);
        });
        greenEl.addEventListener('click', async (e) => {
            log("Turning LED green");
            setRgb(characteristic, 0x00, 0xff, 0x0);
        });
        blueEl.addEventListener('click', async (e) => {
            log("Turning LED blue");
            setRgb(characteristic, 0x00, 0x00, 0xff);
        });
        whiteEl.addEventListener('click', async (e) => {
            log("Turning LED white");
            setRgb(characteristic, 0xff, 0xff, 0xff);
        });
        disconnectButton.addEventListener('click', async (e) => {
            log("Disconnecting");
            await device.gatt.disconnect();
            startButton.style.display = "inline";
            disconnectButton.style.display = "none";
            onOff.style.display = "none";
            redEl.style.display = "none";
            greenEl.style.display = "none";
            blueEl.style.display = "none";
            whiteEl.style.display = "none";
            // Bug: I cannot be bothered to preperly handle event listeners, so just disable restart
            // User needs to reload...
            startButton.outerHTML = startButton.outerHTML;
            startButton.style.display = "none";
            log("Relead page to reconnect...");
        });

    } catch(error) {
        log('Argh! ' + error);
    }
}

async function setRgb(characteristic, red, green, blue) {
    const ledCommand = new Uint8Array([0x55, 0x07, 0x01, red, green, blue]);
    await characteristic.writeValue(ledCommand);
} 

function log(text) {
    output.innerHTML += text + '<br>';
    console.log(text);
}