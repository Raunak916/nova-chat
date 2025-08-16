import { useSubscription } from "@apollo/client";
import { SUBSCRIBE_MESSAGES } from "../graphql/queries";
import {motion, AnimatePresence} from "framer-motion";
import { useAuthenticationStatus } from "@nhost/react";
import {  useEffect, useRef } from "react";
import { toast } from "sonner";
import { Bot } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";


export default function ChatWindow({ chatId , hasChats , isBotReplying}) {
    const { isAuthenticated } = useAuthenticationStatus();
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const { data, loading, error} = useSubscription(SUBSCRIBE_MESSAGES,
        {
            variables:{
                chatId//this should be same as the chatId in the query 
            },
            skip:!chatId, // agar chatId pass nahi kiye then don't run this 
        }
    )
    
    // This useEffect will handle auto-scrolling
        useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [data, isBotReplying]);

    // This useEffect will show a toast on error
    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to load messages.");
        }
    }, [error]);

    //get the scroll state 
    const isScrolled = useScroll(scrollContainerRef);


    //redirect if not logged In
      if (!isAuthenticated) {
        return <Navigate to="/login" />;
      }

      //chats selected nahi hai lekin hai sidebar mai 
      if(!chatId && hasChats){
          return(
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <div>
                <h2 className="text-2xl font-semibold text-foreground">Select a conversation</h2>
                <p className="text-muted-foreground mt-2">Choose a chat from the sidebar to see your messages.</p>
            </div>
          </div>
          )
        }


      if (!chatId && !hasChats) {
        return (
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Welcome to Nova Chat!</h2>
              <p className="text-muted-foreground mt-2">Click the "+" icon in the sidebar to start a new conversation.</p>
            </div>
          </div>
        );
      } 

    if (loading) {
      return (
        <div className="flex-1 p-6 space-y-4 animate-pulse">
            <div className="h-10 w-2/3 rounded-lg bg-muted" />
            <div className="h-16 w-1/2 rounded-lg bg-muted ml-auto" />
            <div className="h-12 w-3/4 rounded-lg bg-muted" />
        </div>
      );
    }

    if (error) return (
        <div className="flex-1 p-6 text-center text-destructive">
            <p>Failed to load messages.</p>
            <p className="text-sm text-muted-foreground">Please try again later.</p>
        </div>
    );

    return (
      <div className="relative flex flex-col h-full bg-background">
      {/* Header */}
      <div className={cn(
        "sticky top-0 left-0 right-0 px-6 py-3 border-b flex flex-col items-center transition-all duration-200 ",
         isScrolled
            ? "border-border bg-background/90 backdrop-blur-lg"
            : "border-border bg-background/20"
        )}>
        <h3 className="font-semibold text-foreground">Chat</h3>
        <p className="text-xs text-muted-foreground">ID: {chatId?.slice(0, 8)}</p>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 pt-24">
        <AnimatePresence>
          {data?.messages?.map((m) => {
            const mine = m.sender === "user";
            return (
              <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-end gap-3 ${mine ? "justify-end" : "justify-start"}`}
                >
    
                  {/* bot icon for assistant messages  */}
                  {!mine && 
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>}
                  
                  {/* message box */}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      mine 
                        ? "bg-primary text-primary-foreground rounded-br-lg" 
                        : "dark:bg-black dark:text-white bg-gray-300 text-black text-card-foreground rounded-bl-lg"
                    }`}
                    >
                      <div className="text-sm leading-relaxed">{m.content}</div>
                      <div className={`text-[10px] mt-1 text-right opacity-70 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </div>
                  </div>
                </motion.div>
            );          
          })}
        </AnimatePresence>

        {isBotReplying &&(
          <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-end gap-3 justify-start"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground flex-shrink-0">
                <Bot className="h-5 w-5" />
            </div>
            <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-card">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.15s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.3s]"></span>
              </div>
            </div>
          </motion.div>
        )}

        {/* for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>
    </div>
    )
}
