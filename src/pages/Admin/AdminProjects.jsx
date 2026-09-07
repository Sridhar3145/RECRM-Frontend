import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
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

  useEffect(() => {
    fetchProjects();
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
      location: "",
      description: "",
    });

    setFieldErrors({});
    setEditingId(null);
  };

  const validateForm = () => {
    const errors = {};

    const name = formData.name.trim();
    const location = formData.location.trim();

    if (!name) {
      errors.name = "Project name is required";
    } else if (name.length < 2) {
      errors.name = "Project name must be at least 2 characters";
    }

    if (!location) {
      errors.location = "Location is required";
    } else if (location.length < 2) {
      errors.location = "Location must be at least 2 characters";
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
        ? `${import.meta.env.VITE_API_URL}/projects/${editingId}`
        : `${import.meta.env.VITE_API_URL}/projects`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          location: formData.location.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setSuccess(
        editingId
          ? "Project updated successfully"
          : "Project created successfully"
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      resetForm();
      fetchProjects();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);

    setFormData({
      name: project.name,
      location: project.location,
      description: project.description || "",
    });

    setFieldErrors({});

    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setSuccess("Project deleted successfully");

      setTimeout(() => {
        setSuccess("");
      }, 3000);

      fetchProjects();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Projects
          </h1>

          <p className="mt-1 text-gray-500">
            Manage real estate projects
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              {editingId ? "Edit Project" : "Add Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Project name"
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
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${fieldErrors.location
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                    }`}
                />

                {fieldErrors.location && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.location}
                  </p>
                )}
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows="4"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Project" : "Create Project"}
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

          <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              Project List
            </h2>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  No projects found
                </p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex flex-col gap-4 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {project.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {project.location}
                      </p>

                      {project.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(project._id)}
                        className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;