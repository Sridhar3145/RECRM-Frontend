import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
 return (
  <div className="min-h-screen bg-[#F1F6F8]">
   <AdminSidebar />

   <main className="min-h-screen md:ml-64">
    <header className="flex h-20 items-center justify-between border-b border-[#E2E8F0] bg-[#F1F6F8] px-8">
     <div>
      <p className="text-sm text-[#64748B]">
       Real Estate CRM
      </p>
     </div>

     <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#68C542] font-bold text-white">
       A
      </div>

      <div>
       <p className="text-sm font-semibold text-[#102A43]">
        Admin
       </p>
       <p className="text-xs text-[#64748B]">
        Administrator
       </p>
      </div>
     </div>
    </header>

    <div className="p-7">
     {children}
    </div>
   </main>
  </div>
 );
};

export default AdminLayout;