import { useEffect, useState } from "react";
import SalesLayout from "../../components/SalesLayout";

const SalesLeads = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
    status: "New",
    notes: "",
    followUpDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/leads`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch leads");
      }

      setLeads(data.leads || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchLeads();
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

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      budget: "",
      status: "New",
      notes: "",
      followUpDate: "",
    });

    setEditingId(null);
    setFieldErrors({});
  };

  const validateForm = () => {
    const errors = {};

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const budget = formData.budget;

    if (!name) {
      errors.name = "Customer name is required";
    } else if (name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (
      !/^\+?[0-9]{7,15}$/.test(phone.replace(/\s+/g, ""))
    ) {
      errors.phone = "Enter a valid phone number";
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errors.email = "Enter a valid email address";
    }

    if (!budget) {
      errors.budget = "Budget is required";
    } else if (Number(budget) <= 0) {
      errors.budget = "Budget must be greater than 0";
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

      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/${editingId}`
        : `${import.meta.env.VITE_API_URL}/leads`;

      const body = editingId
        ? {
          ...formData,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          budget: Number(formData.budget),
          followUpDate: formData.followUpDate || null,
        }
        : {
          ...formData,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          budget: Number(formData.budget),
          assignedTo: user.id,
          followUpDate: formData.followUpDate || null,
        };

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setSuccess(
        editingId
          ? "Lead updated successfully"
          : "Lead created successfully"
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      resetForm();
      fetchLeads();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (lead) => {
    setEditingId(lead._id);

    setFormData({
      name: lead.name || "",
      phone: lead.phone || "",
      email: lead.email || "",
      budget: lead.budget || "",
      status: lead.status || "New",
      notes: lead.notes || "",
      followUpDate: lead.followUpDate
        ? lead.followUpDate.split("T")[0]
        : "",
    });

    setFieldErrors({});
    setError("");
    setSuccess("");
  };

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      lead.name?.toLowerCase().includes(search) ||
      lead.phone?.toLowerCase().includes(search) ||
      lead.email?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <SalesLayout>
      <div className="min-h-screen w-full bg-gray-100 p-3 sm:p-5 lg:p-6">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            My Leads
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Manage your assigned customer leads
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-3 py-3 text-sm text-red-600 sm:px-4">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-100 px-3 py-3 text-sm text-green-600 sm:px-4">
            {success}
          </div>
        )}

        <div className="grid min-w-0 gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="min-w-0 rounded-xl bg-white p-4 shadow sm:p-6">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              {editingId ? "Edit Lead" : "Add Lead"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Customer name"
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
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
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.phone
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                    }`}
                />

                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.phone}
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
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
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
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Budget"
                  min="1"
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.budget
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                    }`}
                />

                {fieldErrors.budget && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.budget}
                  </p>
                )}
              </div>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Interested">Interested</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Booked">Booked</option>
                <option value="Lost">Lost</option>
              </select>

              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
                rows="3"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Lead" : "Create Lead"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="min-w-0 rounded-xl bg-white p-4 shadow sm:p-6 lg:col-span-2">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Assigned Leads
              </h2>

              <span className="text-sm text-gray-500">
                {filteredLeads.length} lead
                {filteredLeads.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone or email..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 sm:flex-1"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 sm:w-52"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Interested">Interested</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Booked">Booked</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-200 text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-sm text-gray-500">
                    <th className="whitespace-nowrap px-4 py-3">
                      Customer
                    </th>

                    <th className="whitespace-nowrap px-4 py-3">
                      Phone
                    </th>

                    <th className="whitespace-nowrap px-4 py-3">
                      Budget
                    </th>

                    <th className="whitespace-nowrap px-4 py-3">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-4 py-3">
                      Follow-up
                    </th>

                    <th className="whitespace-nowrap px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        {searchTerm || statusFilter !== "All"
                          ? "No leads match your search or filter"
                          : "No assigned leads found"}
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead._id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800">
                          {lead.name}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          {lead.phone}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          ₹{lead.budget?.toLocaleString("en-IN")}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                            {lead.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          {lead.followUpDate
                            ? new Date(
                              lead.followUpDate
                            ).toLocaleDateString("en-IN")
                            : "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <button
                            onClick={() => handleEdit(lead)}
                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                          >
                            Edit
                          </button>
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
    </SalesLayout>
  );
};

export default SalesLeads;