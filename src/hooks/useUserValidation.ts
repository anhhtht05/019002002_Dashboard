import { useState } from "react";

export interface ValidationErrors {
  [key: string]: string;
}

export function useUserValidation<T extends Record<string, any>>(formData: T, confirmPassword?: string) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (key:  keyof T | "confirmPassword", value: string): string => {
    switch (key) {
      case "name":
        if (!value.trim()) return "Name is required";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      case "confirmPassword":
        if (confirmPassword !== undefined) {
            if (!value) return "Please confirm password";
            if (value !== formData.password) return "Passwords do not match";
        }
        return "";
      case "oldPassword":
        if (!value) return "Current password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      case "newPassword":
        if (!value) return "New password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value === formData.oldPassword) return "New password must be different from old password";
        return "";
      case "confirmNewPassword":
        if (!value) return "Please confirm new password";
        if (value !== formData.newPassword) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    const combinedData = confirmPassword
        ? { ...formData, confirmPassword }
        : { ...formData };

    Object.entries(combinedData).forEach(([key, value]) => {
      const err = validateField(
        key,
        String(value ?? "")
      );
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (
    key:  keyof T | "confirmPassword",
    value: string
  ) => {
    const errMsg = validateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: errMsg }));
  };

  const clearError = (key: keyof T | "confirmPassword") => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[String(key)];
      return newErrors;
    });
  };

  const resetErrors = () => setErrors({});

  return {
    errors,
    setErrors,
    validateField,
    validateAll,
    handleBlur,
    clearError,
    resetErrors  
    };
}
