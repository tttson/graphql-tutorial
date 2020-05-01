import gql from 'graphql-tag';
import { ApolloCache } from 'apollo-cache';
import * as GetCartItemTypes from './pages/__generated__/GetCartItems';
import * as LaunchTileTypes from './pages/__generated__/LaunchTile';
import { Resolvers } from 'apollo-client'
import { GET_CART_ITEMS } from './pages/cart';


export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

# To add a virtual field, first extend the type of the data you're adding the field to in your client schema. Here, we're extending the Launch type:
  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

type ResolverFn = (
  parent: any, 
  args: any, 
  { cache } : { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
    Launch: ResolverMap;
    Mutation: ResolverMap;
  }
// important thing to note is that the resolver API on the client is the same as the resolver API on the server.
// specify a client resolver on the Launch type to tell Apollo Client how to resolve your virtual field
  export const resolvers: AppResolvers = {
    Launch: {
      isInCart: (launch: LaunchTileTypes.LaunchTile, _, { cache }): boolean => {
        const queryResult = cache.readQuery<GetCartItemTypes.GetCartItems>({ 
          query: GET_CART_ITEMS 
        });
        if (queryResult) {
          return queryResult.cartItems.includes(launch.id)
        } 
        return false;
      }
    },
    Mutation: {
        addOrRemoveFromCart: (_, { id }: { id: string }, { cache }): string[] => {
          const queryResult = cache
            .readQuery<GetCartItemTypes.GetCartItems, any>({ 
              query: GET_CART_ITEMS 
            });
          if (queryResult) {
            const { cartItems } = queryResult;
            const data = {
              cartItems: cartItems.includes(id)
                ? cartItems.filter((i) => i !== id)
                : [...cartItems, id],
            };
            cache.writeQuery({ query: GET_CART_ITEMS, data });
            return data.cartItems;
          }
          return [];
        },
      },
  };

//addOrRemoveFromCart -> we destructure the Apollo cache from the context in order to read the query that fetches cart items. Once we have our cart data, we either remove or add the cart item's id passed into the mutation to the list. Finally, we return the updated list from the mutation