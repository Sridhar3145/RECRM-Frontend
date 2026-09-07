import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const AdminUnits = () => {
  const [units, setUnits] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project: "",
    building: "",
    unitNumber: "",
    type: "",
    price: "",
    status: "Available",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      setProjects(data.projects || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/units`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch units");
      }

      setUnits(data.units || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
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

  const resetForm = () => {
    setFormData({
      project: "",
      building: "",
      unitNumber: "",
      type: "",
      price: "",
      status: "Available",
    });

    setFieldErrors({});
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = {};

    const building = formData.building.trim();
    const unitNumber = formData.unitNumber.trim();
    const type = formData.type.trim();
    const price = formData.price;

    if (!formData.project) {
      errors.project = "Please select a project";
    }

    if (!building) {
      errors.building = "Building name is required";
    } else if (building.length < 2) {
      errors.building = "Building name must be at least 2 characters";
    }

    if (!unitNumber) {
      errors.unitNumber = "Unit number is required";
    }

    if (!type) {
      errors.type = "Unit type is required";
    } else if (type.length < 2) {
      errors.type = "Unit type must be at least 2 characters";
    }

    if (!price) {
      errors.price = "Price is required";
    } else if (Number(price) <= 0) {
      errors.price = "Price must be greater than 0";
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
        ? `${import.meta.env.VITE_API_URL}/units/${editingId}`
        : `${import.meta.env.VITE_API_URL}/units`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          building: formData.building.trim(),
          unitNumber: formData.unitNumber.trim(),
          type: formData.type.trim(),
          price: Number(formData.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setSuccess(
        editingId
          ? "Unit updated successfully"
          : "Unit created successfully"
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      resetForm();
      fetchUnits();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (unit) => {
    setEditingId(unit._id);

    setFormData({
      project: unit.project?._id || unit.project || "",
      building: unit.building,
      unitNumber: unit.unitNumber,
      type: unit.type,
      price: unit.price,
      status: unit.status,
    });

    setFieldErrors({});

    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this unit?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/units/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete unit");
      }

      setSuccess("Unit deleted successfully");

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      fetchUnits();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-3 sm:p-5 lg:p-6">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Units
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Manage property units
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

        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="rounded-xl bg-white p-4 shadow sm:p-6">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              {editingId ? "Edit Unit" : "Add Unit"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className={`w-full rounded-lg border bg-white px-4 py-3 outline-none ${fieldErrors.project
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                    }`}
                >
                  <option value="">Select Project</option>

                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>

                {fieldErrors.project && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.project}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  placeholder="Building name"
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.building
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                    }`}
                />

                {fieldErrors.building && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.building}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  placeholder="Unit number"
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.unitNumber
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                    }`}
                />

                {fieldErrors.unitNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.unitNumber}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Type e.g. 2BHK"
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.type
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                    }`}
                />

                {fieldErrors.type && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.type}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  min="1"
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.price
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                    }`}
                />

                {fieldErrors.price && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.price}
                  </p>
                )}
              </div>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Unit" : "Create Unit"}
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
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Unit List
            </h2>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-212.5 text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-sm text-gray-500">
                    <th className="whitespace-nowrap px-4 py-3">
                      Project
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Building
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Unit
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Type
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Price
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Status
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {units.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        No units found
                      </td>
                    </tr>
                  ) : (
                    units.map((unit) => (
                      <tr
                        key={unit._id}
                        className="border-b last:border-b-0"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800">
                          {unit.project?.name || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          {unit.building}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-800">
                          {unit.unitNumber}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          {unit.type}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                          ₹{unit.price?.toLocaleString("en-IN")}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm ${unit.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {unit.status}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(unit)}
                              className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(unit._id)}
                              className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
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

export default AdminUnits;