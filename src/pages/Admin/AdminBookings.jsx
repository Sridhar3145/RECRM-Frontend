import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { CalendarCheck, AlertCircle, RefreshCw } from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

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
      setError(error.message || "Something went wrong");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F1F6F8] p-3 sm:p-5 lg:p-6">
        <div className="mb-5 sm:mb-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#68C542] sm:text-sm">
                Property Management
              </p>

              <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
                Bookings
              </h1>

              <p className="mt-1 text-sm text-[#64748B] sm:text-base">
                View all property bookings
              </p>
            </div>

            <button
              onClick={fetchBookings}
              disabled={loading}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#102A43] shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 sm:gap-3 sm:px-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Unable to load bookings</p>
              <p className="mt-1 wrap-break-word">{error}</p>
            </div>

            <button
              onClick={fetchBookings}
              className="shrink-0 rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 sm:px-3"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm sm:rounded-2xl">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 sm:h-10 sm:w-10">
              <CalendarCheck className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-[#102A43]">
                Booking List
              </h2>

              {!loading && (
                <p className="text-xs text-[#64748B]">
                  {bookings.length} booking
                  {bookings.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {loading ? (
            <div className="px-4 py-12 text-center sm:px-6 sm:py-14">
              <RefreshCw className="mx-auto h-7 w-7 animate-spin text-[#68C542]" />

              <p className="mt-3 text-sm font-medium text-[#64748B]">
                Loading bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6 sm:py-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <CalendarCheck className="h-7 w-7 text-gray-400" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#102A43]">
                No bookings found
              </h3>

              <p className="mt-1 text-sm text-[#64748B]">
                There are no property bookings available yet.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-225 text-left">
                  <thead>
                    <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                        Customer
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                        Phone
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                        Unit
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                        Building
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                        Type
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                        Price
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                        Booked By
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 lg:px-5">
                        Booking Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-[#102A43] lg:px-5">
                          {booking.lead?.name || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#64748B] lg:px-5">
                          {booking.lead?.phone || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 font-medium text-[#102A43] lg:px-5">
                          {booking.unit?.unitNumber || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#64748B] lg:px-5">
                          {booking.unit?.building || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#64748B] lg:px-5">
                          {booking.unit?.type || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#102A43] lg:px-5">
                          ₹
                          {booking.unit?.price
                            ? booking.unit.price.toLocaleString("en-IN")
                            : "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#64748B] lg:px-5">
                          {booking.bookedBy?.name || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-[#64748B] lg:px-5">
                          {booking.bookingDate
                            ? new Date(
                              booking.bookingDate
                            ).toLocaleDateString("en-IN")
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:hidden">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-sm sm:p-4"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-[#102A43]">
                          {booking.lead?.name || "-"}
                        </p>

                        <p className="mt-1 text-sm text-[#64748B]">
                          {booking.lead?.phone || "-"}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Booked
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-4 border-t border-[#E2E8F0] pt-4">
                      <div className="min-w-0">
                        <p className="text-xs text-[#64748B]">Unit</p>
                        <p className="mt-1 truncate text-sm font-medium text-[#102A43]">
                          {booking.unit?.unitNumber || "-"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#64748B]">Building</p>
                        <p className="mt-1 truncate text-sm font-medium text-[#102A43]">
                          {booking.unit?.building || "-"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#64748B]">Type</p>
                        <p className="mt-1 truncate text-sm font-medium text-[#102A43]">
                          {booking.unit?.type || "-"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#64748B]">Price</p>
                        <p className="mt-1 truncate text-sm font-medium text-[#102A43]">
                          ₹
                          {booking.unit?.price
                            ? booking.unit.price.toLocaleString("en-IN")
                            : "-"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#64748B]">Booked By</p>
                        <p className="mt-1 truncate text-sm font-medium text-[#102A43]">
                          {booking.bookedBy?.name || "-"}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#64748B]">
                          Booking Date
                        </p>
                        <p className="mt-1 truncate text-sm font-medium text-[#102A43]">
                          {booking.bookingDate
                            ? new Date(
                              booking.bookingDate
                            ).toLocaleDateString("en-IN")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
