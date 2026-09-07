import { useEffect, useState } from "react";
import SalesLayout from "../../components/SalesLayout";

const SalesProperties = () => {
  const [units, setUnits] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        throw new Error(data.message || "Failed to fetch properties");
      }

      setUnits(data.units || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUnits();
  }, []);

  const filteredUnits = selectedProject
    ? units.filter(
      (unit) => unit.project?._id === selectedProject
    )
    : units;

  return (
    <SalesLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Properties
          </h1>

          <p className="mt-1 text-gray-500">
            View available and booked property units
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-xl bg-white p-5 shadow">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Filter by Project
          </label>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Projects</option>

            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow">
            Loading properties...
          </div>
        ) : filteredUnits.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow">
            No properties found
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUnits.map((unit) => (
              <div
                key={unit._id}
                className="rounded-xl bg-white p-6 shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Unit {unit.unitNumber}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {unit.project?.name || "-"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${unit.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {unit.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Building
                    </span>

                    <span className="text-sm font-medium text-gray-800">
                      {unit.building}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Type
                    </span>

                    <span className="text-sm font-medium text-gray-800">
                      {unit.type}
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-3">
                    <span className="text-sm text-gray-500">
                      Price
                    </span>

                    <span className="text-lg font-bold text-gray-800">
                      ₹{unit.price?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SalesLayout>
  );
};

export default SalesProperties;