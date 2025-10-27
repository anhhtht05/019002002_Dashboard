import { useState } from "react";

export interface ValidationErrors {
  [key: string]: string;
}

const MAC_REGEX = /^([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}$|^([0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4}$|^[0-9A-Fa-f]{12}$/;

export function useDeviceValidation<T extends Record<string, any>>(formData: T) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (key: keyof T, value: string): string => {
    switch (key) {
      case "deviceId":
        if (!value.trim()) return "Device ID is required";
        if (value.length < 4) return "Device ID must be at least 4 characters";
        return "";

      case "deviceName":
        if (!value.trim()) return "Device name is required";
        return "";

      case "deviceType":
        if (!value.trim()) return "Device type is required";
        return "";

      case "hardwareVersion":
        if (!value.trim()) return "Hardware version is required";
        return "";

      case "macAddress":
        if (!value.trim()) return "MAC address is required";
        if (!MAC_REGEX.test(value.trim()))
          return "Invalid MAC address format (e.g. 00:1A:2B:3C:4D:5E)";
        return "";

      case "model":
        if (!value.trim()) return "Model is required";
        return "";

      case "description":
        if (!value.trim()) return "Description is required";
        if (value.length < 5) return "Description must be at least 5 characters";
        return "";

      case "status":
        if (!value.trim()) return "Status is required";
        return "";

      default:
        return "";
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    (Object.keys(formData) as (keyof T)[]).forEach((key) => {
      const value = formData[key];
      if (Array.isArray(value)) {
        if (value.length === 0)
          newErrors[String(key)] = `${String(key)} must have at least one item`;
      } else {
        const err = validateField(key, value ?? "");
        if (err) newErrors[String(key)] = err;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (key: keyof T) => {
    const err = validateField(key, formData[key] ?? "");
    setErrors((prev) => ({ ...prev, [String(key)]: err }));
  };

  const clearError = (key: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[String(key)];
      return newErrors;
    });
  };

  return { errors, validateAll, handleBlur, clearError };
}
