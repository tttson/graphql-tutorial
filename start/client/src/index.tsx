import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles';
// import gql from "graphql-tag";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/'
});

//below is the instantiation of the client object.
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
});

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById('root')
);

//below is to show that Apollo Client will work w plain vanilla js
// client
//   .query({
//     query: gql`
//       query GetLaunch {
//         launch(id: 56) {
//           id
//           mission {
//             name
//           }
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));
