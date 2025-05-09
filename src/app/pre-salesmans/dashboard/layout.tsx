import SideNav from "../../ui/pre-salesmans/dashboard/sidenav";
export default function DashboardDriversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full ">
      <div className="flex h-full flex-col md:flex-row md:overflow-hidden">
        <div className="w-full h-full flex-none md:w-64  ">
          <SideNav />
        </div>
        <div className="w-full h-full flex-grow md:overflow-y-auto ">
          
          {children}
          </div>
      </div>
    </div>
  );
}