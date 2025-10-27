import { useState } from "react";

export interface ValidationErrors {
  [key: string]: string;
}

export function useFirmwareValidation<T extends Record<string, any>>(formData: T) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (key: keyof T, value: any): string => {
    switch (key) {
      case "version":
        if (!value.trim()) return "Version is required";
        if (!/^v\d+\.\d+\.\d+$/.test(value.trim()))
          return "Version must follow format vX.Y.Z (e.g., v1.0.0)";
        return "";

      case "firmwareName":
        if (!value.trim()) return "Firmware name is required";
        return "";

      case "description":
        return "";

      case "modelCompat":
        if (!value || value.length === 0) return "Select at least one compatible model";
        return "";

      case "hardwareCompat":
        if (!value || value.length === 0) return "Select at least one hardware type";
        return "";

      case "file":
        if (!value) return "Firmware file is required";
        if (!value.name.endsWith(".bin")) return "Only .bin files are allowed";
        return "";

      default:
        return "";
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    (Object.keys(formData) as (keyof T)[]).forEach((key) => {
      const error = validateField(key, (formData as any)[key]);
      if (error) newErrors[String(key)] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (key: keyof T) => {
    const err = validateField(key, (formData as any)[key]);
    setErrors((prev) => ({ ...prev, [key]: err }));
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
