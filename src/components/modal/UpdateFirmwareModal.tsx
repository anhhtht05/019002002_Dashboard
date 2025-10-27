import { useState } from "react";
import firmwareService from "../../service/FirmwareService";
import { X } from "lucide-react";
import { UpdateFirmwareRequest } from "../../model/UpdateFirmwareRequest";
import { ModelType, HardwareType } from "../../enums";
import MultiSelect from "../form/MultiSelect";
import Label from "../form/Label";
import Loading from "../../loading/Loading.tsx";
import { useFirmwareValidation } from "../../hooks/useFirmwareValidation";
import Input from "../form/input/InputField.tsx";
import TextArea from "../form/input/TextArea.tsx";

interface Props {
  firmware: any;
  onClose: () => void;
  onSuccess?: (message: { type: "success" | "error"| "warning" | "info"; title: string; message: string }) => void;
}

export default function UpdateFirmwareModal({ firmware, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<UpdateFirmwareRequest>({
    description: firmware.description || "",
    modelCompat: firmware.modelCompat || [],
    hardwareCompat: firmware.hardwareCompat || [],
  });
  const [loading, setLoading] = useState(false);
  const { errors, validateAll, handleBlur, clearError } = useFirmwareValidation(form);

  const handleChange = (key: keyof UpdateFirmwareRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    try {
      console.log(form);
      await firmwareService.updateFirmware(firmware.id, form);
      onSuccess?.({
        type: "success",
        title: "Firmware updated",
        message: `Firware ${firmware.name} updated successfully.`,
      }); 
      onClose();
    } catch (err: any) {
      onSuccess?.({
        type: "error",
        title: "Update failed",
        message: `Update failed: ${err.response.data.message}` || "Failed to update firmware. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <Loading />}
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-[90vw] max-w-5xl p-10 border border-gray-200 dark:border-dark-600 animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-8">
          Update Firmware
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="w-full">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                type="text"
                value={firmware.version}  
                disabled={true}       
                />
            </div>

            <div className="w-full">
              <Label htmlFor="firmwareName">Firmware Name</Label>
              <Input
                id="firmwareName"
                type="text"
                value={firmware.name}
                disabled={true}
              />
            </div>

            <div className="md:col-span-2 w-full">
              <Label htmlFor="description">Description</Label>
              <TextArea
                value={form.description}
                onBlur={() => handleBlur("description")}
                onChange={(value) => handleChange("description", value)}
                rows={6}
                className="w-full"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="w-full"
            tabIndex={0}
            onBlur={() => handleBlur("modelCompat")}>
              <MultiSelect
                label="Model Compatibility"
                options={Object.values(ModelType).map((v) => ({ text: v, value: v }))}
                defaultSelected={form.modelCompat}
                onChange={(values) => handleChange("modelCompat", values)}
              />
              {errors.modelCompat && (<p className="text-red-500 text-sm mt-1">{errors.modelCompat}</p>)}
            </div>

            <div className="w-full"
            tabIndex={0}
            onBlur={() => handleBlur("hardwareCompat")}>
              <MultiSelect
                label="Hardware Compatibility"
                options={Object.values(HardwareType).map((v) => ({ text: v, value: v }))}
                defaultSelected={form.hardwareCompat}
                onChange={(values) => handleChange("hardwareCompat", values)}
              />
              {errors.hardwareCompat && (<p className="text-red-500 text-sm mt-1">{errors.hardwareCompat}</p>)}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-blue-600 text-white py-3.5 font-medium text-lg hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 transition-all duration-200 shadow-md"
          >
            Upload Firmware
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
