import { ApolloClient, InMemoryCache, createHttpLink,split  } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import nhost from './nhost';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const graphqlUrl = nhost.graphql.getUrl()
//HTTP link ( queries / mutations )
const httpLink = createHttpLink({
    uri:graphqlUrl
})


//auth link to attach bearer token 
//this context runs for every request 
const authLink = setContext(async(_,{headers})=>{
    const token = await nhost.auth.getAccessToken();
    return { 
        headers:{
            ...headers,
            ...(token ? {Authorization : `Bearer ${token}`} : {})
            //this bearer token is the same token that we get from usesigninemailpassword
        },
    }
})


//Create the WebSocket link for Subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url:graphqlUrl.replace('http','ws'),
        connectionParams:()=>(
            {
                headers:{
                    Authorization:`Bearer ${nhost.auth.getAccessToken()}`
                }
            }
        )
    })
)

const splitLink = split(
    ({ query })=>{
        const definition = getMainDefinition(query);
        return(
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        )
    },
    wsLink,//if true use this 
    authLink.concat(httpLink)//else use this 
)


//apollo client 
export const apolloClient = new ApolloClient({
    link:splitLink,
    cache:new InMemoryCache(),
})