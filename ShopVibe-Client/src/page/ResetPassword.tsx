import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContextInstance";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const appContext = useContext(AppContext);

  const BackendUrl = appContext?.BackendUrl;

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resteOtp, setResetOtp] = useState("");
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

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

  const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        BackendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      if(data.success){
        toast.success(data.message)
        setIsEmailSent(true)
      }else{
        toast.error(data.message);
      }

    } catch (error: unknown) {
      if(error instanceof Error){
        toast.error(error.message)
      }else{
        toast.error("something went wrong")
      }
    }
  };

  const onSubmitOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpArray = inputsRef.current.map((input) => input?.value || "");

    if (otpArray.some((digit) => digit === "")) {
      return toast.error("Enter all 6 digits");
    }

    setResetOtp(otpArray.join(""));
    setIsOtpSubmited(true);
  };

  const onsubmitNewPassword = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        BackendUrl + "/api/auth/reset-password",
        { email: email, otp: resteOtp, newPassword: newPassword }
      );
      if(data.success){
         toast.success(data.message)
         navigate("/login")
      }else{
        toast.error(data.message);
      }

    } catch (error: unknown) {
      if(error instanceof Error){
        toast.error(error.message)
      }else{
        toast.error("something went wrong")
      }
    }
  };

  if (!appContext) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* enter new email id */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-centermb-6 text-indigo-300 p-2.5">
            Enter Your registrade email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}

      {/*otp input form */}

      {!isOtpSubmited && isEmailSent && (
        <form onSubmit={onSubmitOtp}>
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-sm text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Reset password OTP
              </h2>
              <p className="text-gray-600 mb-6">
                Enter the 6-digit verification code sent to your email.
              </p>

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
                //onClick={}
                className="w-full bg-blue-600 text-white py-2 rounded-md text-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}

      {/* enter new password */}

      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onsubmitNewPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-centermb-6 text-indigo-300 p-2.5">
            Enter new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input
              type="Password"
              placeholder="Password"
              className="bg-transparent outline-none text-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
