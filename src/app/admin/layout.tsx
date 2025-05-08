export default async function AdminLayout({ 
    children 
}: { children: React.ReactNode }) {

    //const session = await getUserSession()
  
    //if (!session || session.user.role !== 'admin') {
    //  redirect('/unauthorized') // o '/login'
    //}
  
    return (
      <div className="min-h-screen ">
        {children}
      </div>
    )
  }