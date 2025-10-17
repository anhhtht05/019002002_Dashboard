export interface RegisterDeviceRequest {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    hardwareVersion?: string;
    serialNumber?: string;
    macAddress?: string;
    manufacturer?: string;
    model?: string;
  }
  