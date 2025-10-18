import { useState } from "react";
import firmwareService from "../../service/FirmwareService";
import { X } from "lucide-react";
import { UpdateFirmwareRequest } from "../../Model/UpdateFirmwareRequest";
import { ModelType, HardwareType } from "../../enums";
import MultiSelect from "../form/MultiSelect";
import Label from "../form/Label";

interface Props {
  firmware: any;
  onClose: () => void;
}

export default function UpdateFirmwareModal({ firmware, onClose }: Props) {
  const [form, setForm] = useState<UpdateFirmwareRequest>({
    description: firmware.description || "",
    modelCompat: firmware.modelCompat || [],
    hardwareCompat: firmware.hardwareCompat || [],
    status: firmware.status || "DRAFT",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof UpdateFirmwareRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await firmwareService.updateFirmware(firmware.id, form);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update firmware");
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          {/* Description */}
          <div className="w-full">
            <Label>Description</Label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              placeholder="Enter firmware description..."
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Compatibility row */}
          <div className="flex flex-col md:flex-row gap-6 mt-2">
            {/* Model Compatibility */}
            <div className="flex-1">
              <MultiSelect
                label="Model Compatibility"
                options={Object.values(ModelType).map((v) => ({
                  text: v,
                  value: v,
                }))}
                defaultSelected={form.modelCompat}
                onChange={(values) => handleChange("modelCompat", values)}
              />
            </div>

            {/* Hardware Compatibility */}
            <div className="flex-1">
              <MultiSelect
                label="Hardware Compatibility"
                options={Object.values(HardwareType).map((v) => ({
                  text: v,
                  value: v,
                }))}
                defaultSelected={form.hardwareCompat}
                onChange={(values) => handleChange("hardwareCompat", values)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="w-full mt-4">
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="RELEASED">RELEASED</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-lg bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 active:scale-[0.98] disabled:bg-gray-400 transition-all duration-200 shadow-md"
          >
            {loading ? "Updating..." : "Update Firmware"}
          </button>
        </form>
      </div>
    </div>
  );
}
