let WDC_Scale = {
    device: null,
    triggerButtonId: 'connectDeviceButton',
    weightInputId:'weight',
    unitInputId:'unit',
    activeDevice: null,
    // {vendorId: 2338, productId: 32771}
    init(){
        this.localStorageSync();
        this.addEventListeners();
        this.weightAndBucket();
    },
    localStorageSync(){
        if(localStorage.getItem('WDC_Scale_device')){
            this.activeDevice = JSON.parse(localStorage.getItem('WDC_Scale_device'));
        }
    },
    saveDeviceToLocalStorage(activeDevice){
        localStorage.setItem('WDC_Scale_device', JSON.stringify(activeDevice));
        console.log(this.localStorage)
    },
    addEventListeners(){
        this.triggerButton = document.getElementById(this.triggerButtonId);
        this.triggerButton.addEventListener('click', this.connect.bind(this));
    },
    async connect(){
        let theFilters = [];

        this.activeDevice = (await navigator.hid.requestDevice({ filters: [] }))?.[0];
        await this.activeDevice.open();
        console.log(this.activeDevice);
        this.activeDevice.oninputreport = (report) => {
            //console.log(report);
            //console.log(report.timeStamp);
            const { value, unit } = this.parseScaleData(report.data)
            //console.log(value, unit)
            document.getElementById('weight').value = value;
            document.getElementById('unit').value = unit;
        }
                // Start the keep-alive interval
                this.keepAliveInterval = setInterval(async () => {
                    try {
                        //await this.activeDevice.sendFeatureReport(0, new Uint8Array([0]));
                    } catch (error) {
                        console.error('Failed to send keep-alive signal:', error);
                    }
                }, 5000); // Send keep-alive signal every 5 seconds
    },
    weightAndBucket(){
        document.querySelector('.items').addEventListener('click', (e) => {
            //console.log(e.target);
            if(e.target.classList.contains('item')){
                const weight = document.getElementById('weight').value;
                const unit = document.getElementById('unit').value;
                if(weight>0){
                    const newBucketItem = document.createElement('div');
                    newBucketItem.classList.add('bucket-item');
                    newBucketItem.innerHTML = e.target.textContent + ' <span class="item-amount">' + weight + unit +'</span>';
                    newBucketItem.dataset.weight = weight;
                    newBucketItem.dataset.unit = unit;
                    document.querySelector('.cashier-bucket').appendChild(newBucketItem);
                }
            }
        })
    },
    parseScaleData (data) {
            const sign = Number(data.getUint8(0)) == 4 ? 1 : -1 // 4 = positive, 5 = negative, 2 = zero
            const unit = Number(data.getUint8(1)) == 2 ? 'g' : 'oz' // 2 = g, 11 = oz
            const value = Number(data.getUint16(3, true)) // this one needs little endian
            return { value: sign * (unit == 'oz' ? value/10 : value), unit }
    }

}


window.addEventListener('DOMContentLoaded', () => {
    WDC_Scale.init();
});
