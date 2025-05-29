import { Search } from "lucide-react"
import { Input } from "@renderer/components/ui/input"

export function Searchbox() {
  return (
    <div className="relative sm:w-[150px] lg:w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10"
      />
    </div>
  )
}
