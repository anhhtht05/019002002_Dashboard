export interface Firmware {
    id: string;
    name: string;
    version: string;
    description: string;
    filePath: string;
    fileSize: number;
    modelCompat: string[];
    hardwareCompat: string[];
    checksum: string;
    status: string;
  }