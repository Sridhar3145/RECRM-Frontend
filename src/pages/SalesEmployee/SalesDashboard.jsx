import { useEffect, useState } from "react";
import SalesLayout from "../../components/SalesLayout";
import {
 Users,
 CalendarCheck,
 ClipboardCheck,
 Building2,
 BookmarkCheck,
} from "lucide-react";

const SalesDashboard = () => {
 const [dashboard, setDashboard] = useState({
  totalLeads: 0,
  todaysFollowUps: 0,
  totalBookings: 0,
  availableUnits: 0,
  bookedUnits: 0,
 });

 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 const fetchDashboard = async () => {
  try {
   const token = localStorage.getItem("token");

   const response = await fetch(
    `${import.meta.env.VITE_API_URL}/dashboard`,
    {
     headers: {
      Authorization: `Bearer ${token}`,
     },
    }
   );

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard");
   }

   setDashboard(data);
  } catch (error) {
   setError(error.message);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchDashboard();
 }, []);

 const cards = [
  {
   title: "My Leads",
   value: dashboard.totalLeads,
   icon: Users,
   iconBg: "bg-blue-100",
   iconColor: "text-blue-600",
  },
  {
   title: "Today's Follow-ups",
   value: dashboard.todaysFollowUps,
   icon: CalendarCheck,
   iconBg: "bg-green-100",
   iconColor: "text-green-600",
  },
  {
   title: "My Bookings",
   value: dashboard.totalBookings,
   icon: ClipboardCheck,
   iconBg: "bg-purple-100",
   iconColor: "text-purple-600",
  },
  {
   title: "Available Units",
   value: dashboard.availableUnits,
   icon: Building2,
   iconBg: "bg-orange-100",
   iconColor: "text-orange-600",
  },
  {
   title: "Booked Units",
   value: dashboard.bookedUnits,
   icon: BookmarkCheck,
   iconBg: "bg-red-100",
   iconColor: "text-red-600",
  },
 ];

 return (
  <SalesLayout>
   <div className="min-h-screen bg-[#F1F6F8] p-6">
    <div className="mb-8">
     <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#68C542]">
      Welcome Back
     </p>

     <h1 className="text-3xl font-bold text-[#102A43]">
      Sales Dashboard
     </h1>

     <p className="mt-1 text-[#64748B]">
      Track your leads, follow-ups and bookings
     </p>
    </div>

    {error && (
     <div className="mb-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-600">
      {error}
     </div>
    )}

    {loading ? (
     <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center text-[#64748B] shadow-sm">
      Loading dashboard...
     </div>
    ) : (
     <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
       const Icon = card.icon;

       return (
        <div
         key={card.title}
         className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
         <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconBg}`}
         >
          <Icon
           className={`h-6 w-6 ${card.iconColor}`}
           strokeWidth={2}
          />
         </div>

         <p className="mt-5 text-sm font-medium text-[#64748B]">
          {card.title}
         </p>

         <h2 className="mt-2 text-3xl font-bold text-[#102A43]">
          {card.value}
         </h2>
        </div>
       );
      })}
     </div>
    )}
   </div>
  </SalesLayout>
 );
};

export default SalesDashboard;