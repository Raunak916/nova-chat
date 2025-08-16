import { gql } from "@apollo/client";

//  User ka apna message save karne ke liye (sender: "user")
export const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chatId: uuid!, $content: String!) {
    insert_messages_one(
      object: { chat_id: $chatId, sender: "user", content: $content }
    ) {
      id
      created_at
    }
  }
`;

//  Hasura Action ko trigger karne ke liye (bot ko bulane ke liye)
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chatId: uuid!, $content: String!) {
    sendMessage(chat_id: $chatId, content: $content) 
  }
`;

// Live messages ke liye Subscription
// ChatWindow mein useQuery ko isse replace karna hoga
export const SUBSCRIBE_MESSAGES = gql`
  subscription Messages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } },
      order_by: { created_at: asc }
    ) {
      id
      sender
      content
      created_at
    }
  }
`;

// Naya: New chat create karne ke liye
export const CREATE_CHAT = gql`
  mutation CreateChat {
    insert_chats_one(object: {}) {
      id
      created_at
    }
  }
`;


export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
    }
  }
`;

export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: uuid!) {
    delete_chats_by_pk(id: $chatId) {
      id
    }
  }
`;