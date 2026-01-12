import { useState, useRef, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContextInstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OtpVerificationPage() {
  axios.defaults.withCredentials = true;

  const appContext = useContext(AppContext);

  const BackendUrl = appContext?.BackendUrl;
  const getUserData = appContext?.getUserData;
  const isLoggedIn = appContext?.isLoggedIn;
  const userData = appContext?.userData;
  const sendVerificationOtp = appContext?.sendVerificationOtp;

  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!getUserData) return;

    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      return toast.error("Enter 6 Digit Otp");
    }
    try {
      const { data } = await axios.post(
        BackendUrl + "/api/auth/verify-account",
        { otp: fullOtp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    // get up to 6 chars and keep only digits
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);
    const pasteArray = paste.split("");

    const newOtp = [...otp];

    pasteArray.forEach((char: string, index: number) => {
      if (index >= 6) return;
      if (!/^[0-9]$/.test(char)) return; // only digits
      newOtp[index] = char;
      const input = inputsRef.current[index];
      if (input) input.value = char;
    });

    setOtp(newOtp);

    // focus the last filled input (or last box)
    const focusIndex = Math.min(pasteArray.length - 1, 5);
    if (focusIndex >= 0) inputsRef.current[focusIndex]?.focus();
  };

  useEffect(() => {
    if(isLoggedIn && userData?.isAccountVerified){
       navigate("/")};
  }, [isLoggedIn, userData,navigate]);

  if (!appContext) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit verification code sent to your email.
        </p>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-3 mb-6 ">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              required
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 border rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md text-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>

        {/* Resend Link */}
        <p
          className="mt-4 text-blue-600 cursor-pointer hover:underline"
          onClick={sendVerificationOtp}
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
}
