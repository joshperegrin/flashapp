import { SidebarInset, SidebarProvider } from "@renderer/components/ui/sidebar"
import { AppSidebar } from "@renderer/components/app-sidebar"



function App(): React.JSX.Element {
  
  
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main>
            <p className="text-blue-600 dark:text-sky-400"> Hello World!</p>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default App
