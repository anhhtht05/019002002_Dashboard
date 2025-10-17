export interface UploadFirmwareRequest {
    version: string;
    firmwareName: string;
    description: string;
    modelCompat: [];
    hardwareCompat: [];
    file: File;
  }
  