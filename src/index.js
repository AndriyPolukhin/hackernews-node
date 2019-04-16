/*
  Main server file
*/
const { GraphQLServer } = require("graphql-yoga");

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.prisma.links();
    }
  },
  Mutation: {
    // 2. post resolver
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      });
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
