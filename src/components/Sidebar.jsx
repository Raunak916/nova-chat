import { useQuery, useMutation } from "@apollo/client";
import { GET_CHATS, CREATE_CHAT, DELETE_CHAT } from "@/graphql/queries";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Import the cn utility for merging classes

export default function Sidebar({ selectedChatId, onSelect }) {
  const { data, loading, error } = useQuery(GET_CHATS);

  const [createChat, { loading: creatingChat }] = useMutation(CREATE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }],
  });

  const [deleteChat] = useMutation(DELETE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }],
    update: (cache, { data: { delete_chats_by_pk } }) => {
      if (delete_chats_by_pk && selectedChatId === delete_chats_by_pk.id) {
        onSelect(null);
      }
    },
  });

  const handleNewChat = async () => {
    try {
      const { data } = await createChat();
      if (data?.insert_chats_one?.id) {
        onSelect(data.insert_chats_one.id);
      }
    } catch {
      toast.error("Failed to create a new chat.");
    }
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteChat({ variables: { chatId } });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r border-border">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between flex-shrink-0 border-b border-border mb-3">
        <h2 className="font-semibold text-lg">Your Chats</h2>
        <Button variant="ghost" size="icon" onClick={handleNewChat} disabled={creatingChat} 
        className="flex items-center justify-center">
          {creatingChat ? (
            <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" role="status" aria-label="loading"></span>
          ) : (
            <MessageSquarePlus className="w-5 h-5 text-primary" />
          )}
        </Button>
      </div>

      {/* Search Box
      <div className="p-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search chats..." className="pl-8" />
        </div>
      </div> */}

      {/* Chat List */}
      <div className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
        {/* ... loading and error states ... */}
        {loading && (
          <div className="p-4 space-y-2">
            <div className="h-12 rounded-lg bg-muted animate-pulse" />
            <div className="h-12 rounded-lg bg-muted animate-pulse" />
            <div className="h-12 rounded-lg bg-muted animate-pulse" />
          </div>
        )}
        {error && <p className="text-sm text-destructive px-2">Failed to load chats.</p>}

        <AnimatePresence>
          {data?.chats?.map((chat) => (
          
            <motion.div
              key={chat.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              onClick={() => onSelect(chat.id)}
              className={cn(
                "group w-full h-auto flex items-center justify-between text-left p-3 rounded-md cursor-pointer border-border transition-colors bg-black/5 dark:bg-white/10 backdrop-blur-md mb-2",
                selectedChatId === chat.id
                  ? "dark:bg-primary bg-primary text-primary-foreground"
                  : "dark:hover:bg-accent dark:hover:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">Chat {chat.id.slice(0, 8)}</div>
                <div className="text-xs opacity-70 truncate">
                  {new Date(chat.created_at).toLocaleString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7"
              >
                <Trash2 size={16} />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        
        {!loading && !error && data?.chats?.length === 0 && (
          <div className="p-3 text-sm text-muted-foreground">No chats yet.</div>
        )}
      </div>
    </div>
  );
}