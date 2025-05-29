import * as React from 'react'
import { Button } from "@renderer/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu"


export default function DropdownFilterCards(){
  const [selectedTopic, setSelectedTopic] = React.useState('All')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" role="combobox" className="sm:w-[150px] lg:w-[200px] justify-between">
          { selectedTopic }
          <ChevronsUpDown/>
        </Button>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => {setSelectedTopic("All")}}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {setSelectedTopic("Starred")}}>
            Starred
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
