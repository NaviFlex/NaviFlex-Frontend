export default async function DriversLayout({ 
    children 
}: { children: React.ReactNode }) {

    //const session = await getUserSession()
  
    //if (!session || session.user.role !== 'admin') {
    //  redirect('/unauthorized') // o '/login'
    //}
  
    return (
<div className="h-screen md:pt-8 md:pb-8 md:pl-6 md:pr-6">
{children}
      </div>
    )
  }