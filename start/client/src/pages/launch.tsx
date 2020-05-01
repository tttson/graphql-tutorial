import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';
import { RouteComponentProps } from '@reach/router';
import * as LaunchDetailsTypes from './__generated__/LaunchDetails';

import { LAUNCH_TILE_DATA } from './launches';

//first, write the query
// note - we commented out some fields below to refactor our queries to use the LaunchTile fragment
export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      # query your virtual field on the launch detail page  and specify the @client directive:
      isInCart @client
      # id
      site
      # isBooked
      rocket {
        # id
        # name
        type
      }
      ...LaunchTile
      # mission {
      #   name
      #   missionPatch
      # }
    }
  }
  ${LAUNCH_TILE_DATA}
`;
// When we have two GraphQL operations that contain the same fields, we can use a fragment to share fields between the two.
// We define a GraphQL fragment by giving it a name (LaunchTile) and defining it on a type on our schema (Launch). The name we give our fragment can be anything, but the type must correspond to a type in our schema.
//importing LAUNCH TILE DATA from launches to get accesss to the fragment

//second, render a component with useQuery to execute it.
interface LaunchProps extends RouteComponentProps {
  launchId?: any;
}

const Launch: React.FC<LaunchProps> = ({ launchId }) => {
  const {
    data,
    loading,
    error
  } = useQuery<
    LaunchDetailsTypes.LaunchDetails,
    LaunchDetailsTypes.LaunchDetailsVariables
  >(GET_LAUNCH_DETAILS,
    { variables: { launchId } }
  );

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header image={data.launch && data.launch.mission && data.launch.mission.missionPatch}>
        {data && data.launch && data.launch.mission && data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
    </Fragment>
  );
}

export default Launch;
