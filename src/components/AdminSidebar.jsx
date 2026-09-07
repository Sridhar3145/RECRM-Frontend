import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
 LayoutDashboard,
 Users,
 Building2,
 CalendarCheck,
 LogOut,
 Grid2X2,
 Menu,
 X,
} from "lucide-react";

const AdminSidebar = () => {
 const [isOpen, setIsOpen] = useState(false);

 const menuItems = [
  {
   title: "Dashboard",
   path: "/admindashboard",
   icon: LayoutDashboard,
  },
  {
   title: "Leads",
   path: "/adminleads",
   icon: Users,
  },
  {
   title: "Projects",
   path: "/adminprojects",
   icon: Building2,
  },
  {
   title: "Units",
   path: "/adminunits",
   icon: Grid2X2,
  },
  {
   title: "Bookings",
   path: "/adminbookings",
   icon: CalendarCheck,
  },
  {
   title: "Users",
   path: "/adminusers",
   icon: Users,
  },
 ];

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
 };

 return (
  <>
   {/* Mobile Header */}
   <div className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-4 shadow-sm md:hidden">
    <div>
     <h1 className="text-xl font-bold text-[#102A43]">
      RealEstate
     </h1>

     <p className="text-xs font-semibold text-[#68C542]">
      CRM
     </p>
    </div>

    <button
     onClick={() => setIsOpen(true)}
     className="rounded-lg p-2 text-[#102A43] hover:bg-gray-100"
     aria-label="Open menu"
    >
     <Menu className="h-6 w-6" />
    </button>
   </div>

   {/* Mobile Overlay */}
   {isOpen && (
    <div
     onClick={() => setIsOpen(false)}
     className="fixed inset-0 z-40 bg-black/30 md:hidden"
    />
   )}

   {/* Sidebar */}
   <aside
    className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#DCE9ED] px-5 py-6 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"
     }
        md:translate-x-0`}
   >
    {/* Logo */}
    <div className="mb-10 flex items-start justify-between px-2">
     <div>
      <h1 className="text-2xl font-bold text-[#102A43]">
       RealEstate
      </h1>

      <p className="text-sm font-semibold text-[#68C542]">
       CRM
      </p>
     </div>

     {/* Mobile Close Button */}
     <button
      onClick={() => setIsOpen(false)}
      className="rounded-lg p-1 text-[#334E68] hover:bg-white/70 md:hidden"
      aria-label="Close menu"
     >
      <X className="h-5 w-5" />
     </button>
    </div>

    {/* Menu Title */}
    <div className="mb-4 px-2">
     <p className="text-sm font-bold uppercase tracking-wider text-[#536276]">
      Main Menu
     </p>
    </div>

    {/* Navigation */}
    <nav className="flex-1 space-y-2">
     {menuItems.map((item) => {
      const Icon = item.icon;

      return (
       <NavLink
        key={item.path}
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) =>
         `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
          ? "bg-[#68C542] text-white shadow-sm"
          : "text-[#334E68] hover:bg-white/70"
         }`
        }
       >
        <Icon className="h-5 w-5" />
        <span>{item.title}</span>
       </NavLink>
      );
     })}
    </nav>

    {/* Logout */}
    <button
     onClick={handleLogout}
     className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#334E68] hover:bg-[#68C542] hover:text-white"
    >
     <LogOut size={18} />
     <span>Logout</span>
    </button>
   </aside>
  </>
 );
};

export default AdminSidebar;