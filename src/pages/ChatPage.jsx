import { useAuthenticationStatus, useSignOut } from '@nhost/react';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { GET_CHATS } from '../graphql/queries';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import Navbar from '@/components/Navbar';
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState(() => localStorage.getItem('selectedChatId'));
  
  //Authorisation 
  const { isAuthenticated } = useAuthenticationStatus();//tells if the user is logged in or not , if not redirect to login
  const { signOut } = useSignOut();// logs the user out 

  const{ data:chatsData , loading:chatsLoading} = useQuery(GET_CHATS)
  const [isBotReplying, setIsBotReplying] = useState(false);

  const hasChats = !chatsLoading && chatsData?.chats.length > 0 ;
  
  // Persist selected chat ID to localStorage
  useEffect(() => {
    if (selectedChatId) {
      localStorage.setItem('selectedChatId', selectedChatId);
    } else {
      localStorage.removeItem('selectedChatId');
    }
  }, [selectedChatId]);

  //redirect if not logged In
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className='h-screen flex flex-col bg-background text-foreground font-montserrat'>
      {/* Top Bar */}
      <Navbar signOut={signOut}/>
      
      {/* Content */}
      {/* Resizable Panel Layout */}
      <PanelGroup direction="horizontal" className="flex-1 overflow-hidden">

        {/* Sidebar only visible on large screens */}
        <Panel 
         defaultSize={25} 
         minSize={20} 
         className="flex flex-col">
          <Sidebar selectedChatId={selectedChatId} onSelect={setSelectedChatId} />
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
        <Panel defaultSize={75} minSize={30} className="flex flex-col">
          <ChatWindow 
            chatId={selectedChatId} 
            hasChats={hasChats}
            isBotReplying={isBotReplying} 
            setIsBotReplying={setIsBotReplying}
          />
        
          {selectedChatId && (
            <ChatInput 
              chatId={selectedChatId}
              setIsBotReplying={setIsBotReplying}
            />
          )}
        </Panel>
      </PanelGroup>
    </div>
  );
}
