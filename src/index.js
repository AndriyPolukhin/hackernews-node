/*
  Main server file
*/
const { GraphQLServer } = require("graphql-yoga");

// Use to store links at runtime. Store in-memory /not database
let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

// 1. var to creat a new id for links
let idCount = links.length;

// 2. Implementation of the GraphQL Schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    //  new resolver for the feed schema type
    feed: () => links
  },
  Mutation: {
    // 2. post resolver
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    }
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
  typeDefs: "./src/schema.graphql",
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
