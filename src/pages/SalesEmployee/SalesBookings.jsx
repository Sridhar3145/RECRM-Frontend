import { useEffect, useState } from "react";
import SalesLayout from "../../components/SalesLayout";

const SalesBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    lead: "",
    unit: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      setError(error.message);
    }
  };

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

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/units`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch units");
      }

      setUnits(
        (data.units || []).filter(
          (unit) => unit.status === "Available"
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchLeads();
    fetchUnits();
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

    if (!formData.lead) {
      errors.lead = "Please select a lead";
    }

    if (!formData.unit) {
      errors.unit = "Please select an available unit";
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
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setSuccess("Booking created successfully");

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      setFormData({
        lead: "",
        unit: "",
      });

      setFieldErrors({});

      fetchBookings();
      fetchUnits();
      fetchLeads();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <SalesLayout>
      <div className="min-h-screen w-full bg-gray-100 p-3 sm:p-5 lg:p-6">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Bookings
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Create and manage your property bookings
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
              Create Booking
            </h2>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <select
                    name="lead"
                    value={formData.lead}
                    onChange={handleChange}
                    className={`w-full rounded-lg border bg-white px-4 py-3 outline-none ${fieldErrors.lead
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                      }`}
                  >
                    <option value="">Select Lead</option>

                    {leads.map((lead) => (
                      <option key={lead._id} value={lead._id}>
                        {lead.name} - {lead.phone}
                      </option>
                    ))}
                  </select>

                  {fieldErrors.lead && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.lead}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className={`w-full rounded-lg border bg-white px-4 py-3 outline-none ${fieldErrors.unit
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                      }`}
                  >
                    <option value="">
                      Select Available Unit
                    </option>

                    {units.map((unit) => (
                      <option key={unit._id} value={unit._id}>
                        {unit.project?.name || "Project"} -{" "}
                        {unit.building} - Unit {unit.unitNumber}
                      </option>
                    ))}
                  </select>

                  {fieldErrors.unit && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.unit}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Create Booking
                </button>
              </form>
            )}
          </div>

          <div className="min-w-0 rounded-xl bg-white p-4 shadow sm:p-6 lg:col-span-2">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              My Bookings
            </h2>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-187.5 text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-sm text-gray-500">
                    <th className="whitespace-nowrap px-4 py-3">
                      Customer
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Unit
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Building
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Type
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Price
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800">
                          {booking.lead?.name || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800">
                          {booking.unit?.unitNumber || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          {booking.unit?.building || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          {booking.unit?.type || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          ₹
                          {booking.unit?.price?.toLocaleString("en-IN") ||
                            "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          {booking.bookingDate
                            ? new Date(
                              booking.bookingDate
                            ).toLocaleDateString("en-IN")
                            : "-"}
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

export default SalesBookings;