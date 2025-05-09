export default async function AdminLayout({ 
    children 
}: { children: React.ReactNode }) {

    //const session = await getUserSession()
  
    //if (!session || session.user.role !== 'admin') {
    //  redirect('/unauthorized') // o '/login'
    //}
  
    return (
      <div className="h-screen pt-8 pb-8 pl-6 pr-6 border-2 border-red-500">
        {children}
      </div>
    )
  }