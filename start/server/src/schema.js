const {gql} = require('apollo-server')

const typeDefs = gql`
type Launch {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
  isBooked: Boolean!
}

type Rocket {
  id: ID!
  name: String
  type: String
}

type User {
  id: ID!
  email: String!
  trips: [Launch]!
}

type Mission {
  name: String
  missionPatch(size: PatchSize): String
}

enum PatchSize {
  SMALL
  LARGE
}

type Query {
  allUsers: [User]!
  launches(
    """
    The number of results to show. Must be >= 1. Default = 20
    """
    pageSize: Int
    """
    If you add a cursor here, it will only return results _after_ this cursor
    """
    after: String
  ): LaunchConnection!
  launch(id: ID!): Launch
  me: User
}

"""
Simple wrapper around our list of launches that contains a cursor to the
last item in the list. Pass this cursor to the launches query to fetch results
after these.
"""
type LaunchConnection { # add this below the Query type as an additional type.
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}

type Mutation {
  bookTrips(launchIds: [ID]!): TripUpdateResponse!
  cancelTrip(launchId: ID!): TripUpdateResponse!
  login(email: String): String
}

type TripUpdateResponse {
  success: Boolean!
  message: String
  launches: [Launch]
}
`

//allUsersByLaunchId(id: ID!): User -> trips -> filter by launch id

// TripUpdateResponse -  It's good practice for a mutation to return whatever objects it modifies so the requesting client can update its cache and UI without needing to make a followup query.

// The Launch object type has a collection of fields(id, site,mission,rocket, isBooked), and each field has a type of its own. A field's type can be either an object type or a scalar type. Mission and Rocket refer to other object types.

// If a declared field's type is in [Square Brackets], it's an array of the specified type. If an array has an exclamation point after it, the array cannot be null, but it can be empty.

// the schema sits directly between your application clients and your underlying data services, front-end and back-end teams should collaborate on its structure.


module.exports = typeDefs;


// Your GraphQL schema defines what types of data a client can read and write to your data graph.

//functionalities we want:
// - Fetch a list of all upcoming rocket launches
// - Fetch a specific launch by its ID
// - Log in the user
// - Book a launch for a logged-in user
// - Cancel a previously booked launch for a logged-in user
