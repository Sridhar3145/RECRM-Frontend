import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const AdminUsers = () => {
 const [users, setUsers] = useState([]);
 const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  role: "sales employee",
 });

 const [error, setError] = useState("");
 const [success, setSuccess] = useState("");
 const [fieldErrors, setFieldErrors] = useState({});

 const fetchUsers = async () => {
  try {
   const token = localStorage.getItem("token");

   const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users`,
    {
     headers: {
      Authorization: `Bearer ${token}`,
     },
    }
   );

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
   }

   setUsers(data.users || []);
  } catch (error) {
   setError(error.message);
  }
 };

 useEffect(() => {
  fetchUsers();
 }, []);

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

  const name = formData.name.trim();
  const email = formData.email.trim();
  const password = formData.password;

  if (!name) {
   errors.name = "Full name is required";
  } else if (name.length < 2) {
   errors.name = "Name must be at least 2 characters";
  }

  if (!email) {
   errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

  try {
   const token = localStorage.getItem("token");

   const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users`,
    {
     method: "POST",
     headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
     }),
    }
   );

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || "Failed to create user");
   }

   setSuccess("User created successfully");

   setTimeout(() => {
    setSuccess("");
   }, 3000);

   setFormData({
    name: "",
    email: "",
    password: "",
    role: "sales employee",
   });

   setFieldErrors({});
   fetchUsers();
  } catch (error) {
   setError(error.message);
  }
 };

 const handleDelete = async (id) => {
  const confirmed = window.confirm(
   "Are you sure you want to delete this user?"
  );

  if (!confirmed) return;

  try {
   const token = localStorage.getItem("token");

   const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/${id}`,
    {
     method: "DELETE",
     headers: {
      Authorization: `Bearer ${token}`,
     },
    }
   );

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
   }

   setSuccess("User Delete successfully");

   setTimeout(() => {
    setSuccess("");
   }, 3000);

   fetchUsers();
  } catch (error) {
   setError(error.message);
  }
 };

 return (
  <AdminLayout>
   <div className="w-full">
    <div className="mb-5 sm:mb-6">
     <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
      Users
     </h1>

     <p className="mt-1 text-sm text-[#64748B] sm:text-base">
      Manage sales employees and system users
     </p>
    </div>

    {error && (
     <div className="mb-4 rounded-xl bg-red-100 px-3 py-3 text-sm text-red-600 sm:px-4">
      {error}
     </div>
    )}

    {success && (
     <div className="mb-4 rounded-xl bg-green-100 px-3 py-3 text-sm text-green-700 sm:px-4">
      {success}
     </div>
    )}

    <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
     <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-5 text-xl font-semibold text-[#102A43]">
       Add User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <input
         type="text"
         name="name"
         value={formData.name}
         onChange={handleChange}
         placeholder="Full name"
         className={`w-full rounded-xl border px-4 py-3 outline-none ${fieldErrors.name
          ? "border-red-500"
          : "border-[#E2E8F0] focus:border-[#68C542]"
          }`}
        />

        {fieldErrors.name && (
         <p className="mt-1 text-xs text-red-500">
          {fieldErrors.name}
         </p>
        )}
       </div>

       <div>
        <input
         type="email"
         name="email"
         value={formData.email}
         onChange={handleChange}
         placeholder="Email"
         className={`w-full rounded-xl border px-4 py-3 outline-none ${fieldErrors.email
          ? "border-red-500"
          : "border-[#E2E8F0] focus:border-[#68C542]"
          }`}
        />

        {fieldErrors.email && (
         <p className="mt-1 text-xs text-red-500">
          {fieldErrors.email}
         </p>
        )}
       </div>

       <div>
        <input
         type="password"
         name="password"
         value={formData.password}
         onChange={handleChange}
         placeholder="Password"
         className={`w-full rounded-xl border px-4 py-3 outline-none ${fieldErrors.password
          ? "border-red-500"
          : "border-[#E2E8F0] focus:border-[#68C542]"
          }`}
        />

        {fieldErrors.password && (
         <p className="mt-1 text-xs text-red-500">
          {fieldErrors.password}
         </p>
        )}
       </div>

       <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 outline-none focus:border-[#68C542]"
       >
        <option value="sales">Sales Employee</option>
        <option value="admin">Admin</option>
       </select>

       <button
        type="submit"
        className="w-full rounded-xl bg-[#68C542] py-3 font-semibold text-white hover:opacity-90"
       >
        Create User
       </button>
      </form>
     </div>

     <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
      <h2 className="mb-5 text-xl font-semibold text-[#102A43]">
       System Users
      </h2>

      <div className="w-full overflow-x-auto">
       <table className="w-full min-w-162.5 text-left">
        <thead>
         <tr className="border-b border-[#E2E8F0] text-sm text-[#64748B]">
          <th className="whitespace-nowrap px-4 py-3">
           Name
          </th>
          <th className="whitespace-nowrap px-4 py-3">
           Email
          </th>
          <th className="whitespace-nowrap px-4 py-3">
           Role
          </th>
          <th className="whitespace-nowrap px-4 py-3">
           Actions
          </th>
         </tr>
        </thead>

        <tbody>
         {users.length === 0 ? (
          <tr>
           <td
            colSpan="4"
            className="px-4 py-10 text-center text-[#64748B]"
           >
            No users found
           </td>
          </tr>
         ) : (
          users.map((user) => (
           <tr
            key={user._id}
            className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]"
           >
            <td className="whitespace-nowrap px-4 py-4 font-medium text-[#102A43]">
             {user.name}
            </td>

            <td className="whitespace-nowrap px-4 py-4 text-[#64748B]">
             {user.email}
            </td>

            <td className="whitespace-nowrap px-4 py-4">
             <span className="rounded-full bg-[#E8F5E2] px-3 py-1 text-sm font-medium text-[#4A9B2D]">
              {user.role === "sales employee"
               ? "Sales Employee"
               : "Admin"}
             </span>
            </td>

            <td className="px-4 py-4">
             {user.role === "sales employee" && (
              <button
               onClick={() => handleDelete(user._id)}
               className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
              >
               Delete
              </button>
             )}
            </td>
           </tr>
          ))
         )}
        </tbody>
       </table>
      </div>
     </div>
    </div>
   </div>
  </AdminLayout>
 );
};

export default AdminUsers;