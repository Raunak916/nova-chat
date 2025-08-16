import ThemeToggle from "./ThemeToggle";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // 1. Import the shadcn Button

export default function Navbar({ signOut }) {
  return (
    <header className="sticky top-0 z-10 h-14 px-4 border-b border-border flex items-center justify-between bg-background/80 backdrop-blur-lg font-special-gothic">
      <div className='flex items-center gap-2'>
        <img src="/nova-lightLogo.svg" alt="Nova Logo" className="w-8 h-8"/>
        <h1 className='font-bold text-lg text-foreground'>Nova Chat</h1>
      </div>
      <div className='flex items-center gap-4'>
        <ThemeToggle />
        
        <Button variant="ghost" size={"default"} onClick={signOut} 
        className="hover:bg-destructive hover:text-destructive-foreground">
          Logout
        </Button>
      </div>
    </header>
  );
}