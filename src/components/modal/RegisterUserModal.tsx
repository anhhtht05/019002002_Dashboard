import React, { useState } from "react";
import { X } from "lucide-react";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Button from "../ui/button/Button.tsx";
import { EyeIcon, EyeCloseIcon } from "../../icons";
import Loading from "../../loading/Loading.tsx";
import { AddUserRequest } from "../../model/AddUserRequest.ts";
import userService from "../../service/UserService.ts";

interface RegisterUserModalProps {
  onClose: () => void;
}

const RegisterUserModal: React.FC<RegisterUserModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<AddUserRequest>({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateField = (key: keyof AddUserRequest | "confirmPassword", value: string): string => {
    switch (key) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 3)
          return "Name must be at least 3 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\-=/\\]).{8,}$/.test(
            value
          )
        )
          return "Password must be 8+ chars, include upper, lower, number, and special char";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm password";
        if (value !== formData.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    Object.entries({ ...formData, confirmPassword }).forEach(([key, value]) => {
      const err = validateField(key as keyof AddUserRequest | "confirmPassword", value);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: keyof AddUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleBlur = (key: keyof AddUserRequest | "confirmPassword", value: string) => {
    const errMsg = validateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: errMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    try {
      const res = await userService.addUser(formData);
      console.log("Response:", res);
      alert("User added successfully!");
      onClose();
    } catch (err: any) {
      console.error("Register failed:", err);
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Server error";
      alert(`Add user failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
        <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-[90vw] max-w-md p-8 border border-gray-200 dark:border-dark-600 animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-6">
            Add New User
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-base font-medium">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`h-12 text-base ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                // onBlur={(e) => handleBlur("email", e.target.value)}
                
                className={`h-12 text-base ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-base font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  // onBlur={(e) => handleBlur("password", e.target.value)}
                  className={`h-12 text-base ${errors.password ? "border-red-500" : ""}`}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-base font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  // onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                  className={`h-12 text-base ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showConfirm ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 text-white text-lg py-3.5 rounded-lg shadow-md active:scale-[0.98] transition-all bg-blue-600 hover:bg-blue-700"
            >
              Add User
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterUserModal;
