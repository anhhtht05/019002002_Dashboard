import React, { useState } from "react";
import { X } from "lucide-react";
import firmwareService from "../../service/FirmwareService";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import MultiSelect from "../form/MultiSelect";
import { ModelType, HardwareType } from "../../enums";
import { UploadFirmwareRequest } from "../../model/UploadFirmwareRequest";
import TextArea from "../form/input/TextArea";

interface RegisterFirmwareModalProps {
  onClose: () => void;
}

const RegisterFirmwareModal: React.FC<RegisterFirmwareModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<UploadFirmwareRequest>({
    version: "",
    firmwareName: "",
    description: "",
    modelCompat: [],    
    hardwareCompat: [],    
    file: null as unknown as File,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please upload a firmware file!");
      return;
    }

    setLoading(true);
    try {
      const res = await firmwareService.uploadFirmware(formData);

      alert("Firmware uploaded successfully!");
      console.log("Response:", res);
      onClose();
    } catch (err: any) {
      console.error("Upload failed:", err);
      if (err.response) {
        alert(`Upload failed: ${err.response.data.error?.message || "Server error"}`);
      } else {
        alert(`Network error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
  <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-[90vw] max-w-5xl p-10 border border-gray-200 dark:border-dark-600 animate-fadeIn">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
    >
      <X className="w-5 h-5" />
    </button>

    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-8">
      Upload New Firmware
    </h2>

    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="w-full">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            type="text"
            placeholder="e.g. v1.0.9"
            value={formData.version}
            onChange={(e) => handleChange("version", e.target.value)}
          />
        </div>

        <div className="w-full">
          <Label htmlFor="firmwareName">Firmware Name</Label>
          <Input
            id="firmwareName"
            type="text"
            placeholder="e.g. ESP32 Firmware"
            value={formData.firmwareName}
            onChange={(e) => handleChange("firmwareName", e.target.value)}
          />
        </div>

        <div className="md:col-span-2 w-full">
          <Label htmlFor="description">Description</Label>
          <TextArea
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            rows={6}
            placeholder="Enter firmware update details"
            className="w-full"
          />
        </div>

        <div className="w-full">
          <MultiSelect
            label="Model Compatibility"
            options={Object.values(ModelType).map((v) => ({ text: v, value: v }))}
            defaultSelected={formData.modelCompat}
            onChange={(values) => handleChange("modelCompat", values)}
          />
        </div>

        <div className="w-full">
          <MultiSelect
            label="Hardware Compatibility"
            options={Object.values(HardwareType).map((v) => ({ text: v, value: v }))}
            defaultSelected={formData.hardwareCompat}
            onChange={(values) => handleChange("hardwareCompat", values)}
          />
        </div>

        <div className="md:col-span-2 w-full">
          <Label>Firmware File</Label>
          <input
            type="file"
            accept=".bin"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-lg bg-blue-600 text-white py-3.5 font-medium text-lg hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 transition-all duration-200 shadow-md"
      >
        {loading ? "Uploading..." : "Upload Firmware"}
      </button>
    </form>
  </div>
</div>

  );
};

export default RegisterFirmwareModal;
