import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
 Building2,
 Mail,
 Lock,
 ArrowRight,
 ShieldCheck,
} from "lucide-react";

const Login = () => {
 const [formData, setFormData] = useState({
  email: "",
  password: "",
 });

 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [loading, setLoading] = useState(false);
 const [fieldErrors, setFieldErrors] = useState({});

 const navigate = useNavigate();

 const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
   ...formData,
   [name]: value,
  });

  setFieldErrors({
   ...fieldErrors,
   [name]: "",
  });

  setError("");
 };

 const validateForm = () => {
  const errors = {};

  const email = formData.email.trim();
  const password = formData.password;

  if (!email) {
   errors.email = "Email address is required";
  } else if (
   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
   errors.email = "Enter a valid email address";
  }

  if (!password) {
   errors.password = "Password is required";
  } else if (password.length < 6) {
   errors.password = "Password must be at least 6 characters";
  }

  setFieldErrors(errors);

  return Object.keys(errors).length === 0;
 };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  const isValid = validateForm();

  if (!isValid) {
   return;
  }

  setLoading(true);

  try {
   const response = await fetch(
    "http://localhost:5001/auth/login",
    {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify({
      email: formData.email.trim(),
      password: formData.password,
     }),
    }
   );

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || "Login failed");
   }

   localStorage.setItem("token", data.token);
   localStorage.setItem("user", JSON.stringify(data.user));

   setSuccess("Login successful");

   if (data.user.role === "admin") {
    navigate("/admindashboard");
   } else {
    navigate("/salesdashboard");
   }
  } catch (error) {
   setError(error.message || "Something went wrong");
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen w-full bg-[#F1F6F8] lg:flex">
   <div className="relative hidden overflow-hidden bg-[#DCE9ED] lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12 xl:p-16">
    <div className="relative z-10">
     <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#68C542] text-white shadow-sm">
       <Building2 size={24} />
      </div>

      <div>
       <h1 className="text-2xl font-bold text-[#102A43]">
        RealEstate
       </h1>

       <p className="text-sm font-semibold text-[#68C542]">
        CRM
       </p>
      </div>
     </div>
    </div>

    <div className="relative z-10 max-w-xl">
     <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#68C542]">
      Real Estate Management
     </p>

     <h2 className="text-4xl font-bold leading-tight text-[#102A43] xl:text-5xl">
      Manage your real estate business with confidence.
     </h2>

     <p className="mt-5 max-w-lg text-base leading-7 text-[#526A80]">
      Manage leads, properties, bookings and sales activities
      from one simple CRM platform.
     </p>

     <div className="mt-8 flex items-center gap-3 text-sm font-medium text-[#334E68]">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
       <ShieldCheck
        size={19}
        className="text-[#68C542]"
       />
      </div>

      Secure role-based access
     </div>
    </div>

    <p className="relative z-10 text-sm text-[#64748B]">
     © 2026 RealEstate CRM
    </p>

    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#68C542]/10" />

    <div className="absolute -right-10 top-32 h-40 w-40 rounded-full bg-white/30" />
   </div>

   <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-8 sm:py-10 lg:w-1/2 lg:px-12 xl:px-20">
    <div className="w-full max-w-md">
     <div className="mb-8 flex items-center gap-3 sm:mb-10 lg:hidden">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#68C542] text-white shadow-sm">
       <Building2 size={24} />
      </div>

      <div>
       <h1 className="text-2xl font-bold text-[#102A43]">
        RealEstate
       </h1>

       <p className="text-sm font-semibold text-[#68C542]">
        CRM
       </p>
      </div>
     </div>

     <div className="mb-7 sm:mb-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#68C542]">
       Welcome Back
      </p>

      <h1 className="text-2xl font-bold text-[#102A43] sm:text-4xl">
       Sign in to your account
      </h1>

      <p className="mt-3 text-sm leading-6 text-[#64748B]">
       Enter your credentials to access your CRM dashboard.
      </p>
     </div>

     {error && (
      <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
       {error}
      </div>
     )}

     {success && (
      <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
       {success}
      </div>
     )}

     <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
       <div>
        <label className="mb-2 block text-sm font-semibold text-[#334E68]">
         Email Address
        </label>

        <div className="relative">
         <Mail
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
         />

         <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={`w-full rounded-xl border bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm text-[#102A43] outline-none transition placeholder:text-[#94A3B8] focus:bg-white focus:ring-2 ${fieldErrors.email
           ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
           : "border-[#E2E8F0] focus:border-[#68C542] focus:ring-[#68C542]/10"
           }`}
         />
        </div>

        {fieldErrors.email && (
         <p className="mt-1 text-xs text-red-500">
          {fieldErrors.email}
         </p>
        )}
       </div>

       <div>
        <label className="mb-2 block text-sm font-semibold text-[#334E68]">
         Password
        </label>

        <div className="relative">
         <Lock
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
         />

         <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className={`w-full rounded-xl border bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-sm text-[#102A43] outline-none transition placeholder:text-[#94A3B8] focus:bg-white focus:ring-2 ${fieldErrors.password
           ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
           : "border-[#E2E8F0] focus:border-[#68C542] focus:ring-[#68C542]/10"
           }`}
         />
        </div>

        {fieldErrors.password && (
         <p className="mt-1 text-xs text-red-500">
          {fieldErrors.password}
         </p>
        )}
       </div>

       <button
        type="submit"
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#68C542] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5BB637] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
       >
        {loading ? (
         "Signing in..."
        ) : (
         <>
          Sign In

          <ArrowRight
           size={18}
           className="transition-transform group-hover:translate-x-1"
          />
         </>
        )}
       </button>
      </form>
     </div>

     <p className="mt-6 text-center text-xs text-[#94A3B8]">
      Secure access to your RealEstate CRM
     </p>
    </div>
   </div>
  </div>
 );
};

export default Login;