const { Router } = require("express");
const { graphqlHTTP } = require('express-graphql');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const path = require('path'); 
const resolvers = require("../graphQl/resolvers");
const schemaPath = path.join(__dirname, '../graphQl/schema.graphql');
const typeDefs = importSchema(schemaPath)
const { authenticate } = require("../auth/middleware");

const router = Router();

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});


router.use('/graphql', authenticate, graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: { informationToken: req.informationToken }
})));


module.exports = router;
