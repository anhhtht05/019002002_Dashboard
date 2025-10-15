export class Device {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    hardwareVersion: string;
    serialNumber: string;
    macAddress: string;
    manufacturer: string;
    model: string;
    status: string;
  
    constructor(
      deviceId: string,
      deviceName: string,
      deviceType: string,
      hardwareVersion: string,
      serialNumber: string,
      macAddress: string,
      manufacturer: string,
      model: string,
      status: string
    ) {
      this.deviceId = deviceId;
      this.deviceName = deviceName;
      this.deviceType = deviceType;
      this.hardwareVersion = hardwareVersion;
      this.serialNumber = serialNumber;
      this.macAddress = macAddress;
      this.manufacturer = manufacturer;
      this.model = model;
      this.status = status;
    }
  }
  