/*
  Main server file
*/
const { GraphQLServer } = require("graphql-yoga");

// 1. Define the GraphQL Schema
const typeDefs = `
type Query {
  info: String!
  feed: [Link!]!
}

type Link {
  id: ID!
  description: String!
  url: String!
}
`;

// Dummy data. Use to store links at runtime. Store in-memory /not database
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

// 2. Implementation of the GraphQL Schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    //  new resolver for the feed schema type
    feed: () => links
  },
  // 3 more resolvers for the types in Links
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
  }
};

// 3. Bundling and passing to the server
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
