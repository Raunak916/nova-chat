import { useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_CHATS, INSERT_USER_MESSAGE , SEND_MESSAGE_ACTION} from "../graphql/queries";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function ChatInput({ chatId , setIsBotReplying }){
    const [text, setText] = useState("");

    const[insertUserMessage, {loading: inserting}] = useMutation(INSERT_USER_MESSAGE,{
      refetchQueries:[{query:GET_CHATS}]// taaki most recent chats upar reh , to show activities of the user
    });

    const[callAction , {loading:calling}] = useMutation(SEND_MESSAGE_ACTION , {
      onCompleted:()=>setIsBotReplying(false),
      onError:()=>{
        setIsBotReplying(false)
        toast.error("Error sending message")
      }
    })

    const sending = inserting || calling;


    const handleSend = async()=>{
        const content = text.trim();
        if (!content || !chatId) return;

        try {
          setText("");//form ka text hata do after sending
          setIsBotReplying(true)
          //pehle user ka message db mai save karo with sender = user
          await insertUserMessage({
            variables:{
              chatId:String(chatId),
              content
            }
          })

          // abhi hasura action trigger karo for bot replies 
          await callAction({
            variables:{
              chatId:String(chatId),
              content
            }
          })

          //Bot ka reply apne aap subscription se aa jayea
        } catch (error) {
          console.error("Error sending message:", error);
          setText(content) // Restore text on error
          toast.error("Failed to send message. Please try again.");
        }
    }

    const onKeyDown = (e)=>{
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            handleSend();
        }
    }

    return (
      <div className="px-4 py-3 border-t border-border bg-background">
        <div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none bg-transparent outline-none text-sm p-2 placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={sending || text.trim().length === 0}
        
            className="group relative flex items-center justify-center w-10 h-10 hover:w-24 transition-all duration-300 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
           >
            <Send className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-4" />
  
            {/* 4. Text fades in and is positioned absolutely */}
            <span className="absolute right-4 whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Send
            </span>
          </button>          
        </div>
      </div>
    );
}