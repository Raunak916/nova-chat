import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useTheme } from "@/hooks/use-theme" 

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
       <Button
       variant="ghost"
       size="icon"
       onClick={() => setTheme(theme === "light" ? "dark" : "light")}
       className="relative h-9 w-9 rounded-full flex items-center justify-center"
       >
       <Sun className="h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
       <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
       <span className="sr-only">Toggle theme</span>
     </Button>
     
  )
}