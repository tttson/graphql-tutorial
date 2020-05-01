import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { LaunchTile, Header, Button, Loading } from '../components';
import { RouteComponentProps } from '@reach/router';
import * as GetLaunchListTypes from './__generated__/GetLaunchList';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

// First, we're going to build a GraphQL query that fetches a list of launches.
export const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps extends RouteComponentProps {}

const Launches: React.FC<LaunchesProps> = () => {
  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);
  // passing the GET_LAUNCHES query defined above and passing it to useQuery to render the list
  //the above query is only fetching the first 20 launches from the list. To fetch the full list of launches, we need to build a pagination feature that displays a Load More button for loading more items on the screen.
  // To build a paginated list with Apollo, we first need to destructure the fetchMore function from the useQuery result object

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}

        {data.launches &&
          data.launches.hasMore && (
            <Button
              onClick={() =>
                // connecting fetchMore to a button to fetch more items when it's clicked.
                fetchMore({
                  variables: {
                    after: data.launches.cursor,
                  },
                  //need to specify an updateQuery function on the return object from fetchMore that tells the Apollo cache how to update our query with the new items we're fetching.
                  updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                      ...fetchMoreResult,
                      launches: {
                        ...fetchMoreResult.launches,
                        launches: [
                          ...prev.launches.launches,
                          ...fetchMoreResult.launches.launches,
                        ],
                      },
                    };
                  },
                })
              }
            >
              Load More
            </Button>
          )
        }
    </Fragment>
  );
}

export default Launches;
