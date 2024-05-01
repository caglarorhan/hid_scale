#### Digital Scale HID API Example ###
- This example is a dummy cashier screen that uses navigators HID API to get the weight data from digital scale device which is connected over USB. 
- Tested device was  DYMO Digital Postal Scale/Shipping Scale (10-Pound)
- You can connect an HID compatible DYMO digital scale end test [this example](https://caglarorhan.github.io/hid_scale/).
- Or you can twitch the code and use it with your own HID compatible digital scale.
- You might need to change the "oninputreport " event and parse the returned data according to your device.
