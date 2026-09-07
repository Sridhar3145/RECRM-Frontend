import SalesSidebar from "./SalesSidebar";

const SalesLayout = ({ children }) => {
 const user = JSON.parse(localStorage.getItem("user") || "{}");

 return (
  <div className="min-h-screen bg-[#F1F6F8]">
   <SalesSidebar />

   <main className="min-h-screen md:ml-64">
    <header className="flex h-20 items-center justify-between border-b border-[#E2E8F0] bg-[#F1F6F8] px-8">
     <div>
      <p className="text-sm text-[#64748B]">
       Real Estate CRM
      </p>
     </div>

     <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#68C542] font-bold text-white">
       {user.name?.charAt(0).toUpperCase() || "S"}
      </div>

      <div>
       <p className="text-sm font-semibold text-[#102A43]">
        {user.name || "Sales Employee"}
       </p>

       <p className="text-xs text-[#64748B]">
        Sales Employee
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

export default SalesLayout;