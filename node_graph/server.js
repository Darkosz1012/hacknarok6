import {
    Neo4jGraphQL
} from "@neo4j/graphql"
import {
    ApolloServer,
    gql
} from "apollo-server-express"
import neo4j from "neo4j-driver"
import dotenv from 'dotenv'
import OGM from '@neo4j/graphql-ogm'
import schemaql from "./graphql/schema.js";
import graphqlPluginAuth from "@neo4j/graphql-plugin-auth";
import path from "path";
import multer from "multer";
import express from "express";
dotenv.config()

;
(async () => {
    const app = express();
   
    app.use(express.static('public'))
    const storage = multer.diskStorage({
        destination: "./public/uploads/",
        filename: function (req, file, cb) {
            cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1000000
        },
    })
    const router = express.Router();
    app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
       
        console.log("Request ---", req.body);
            console.log("Request file ---", req.file); //Here you get file.
            /*Now do where ever you want to do*/
            if (!err)
                return res.send(200).end();
    })
    const driver = neo4j.driver(
        process.env.NEO4J_URI || 'bolt://localhost:7687',
        neo4j.auth.basic(
            process.env.NEO4J_USER || 'neo4j',
            process.env.NEO4J_PASSWORD || 'neo4j'
        )
    );
    const ogm = new OGM.OGM({
        typeDefs: schemaql.typeDefs,
        driver
    })
    ogm.init()
    // const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
    const neoSchema = new Neo4jGraphQL({
        typeDefs: schemaql.typeDefs,
        driver,
        resolvers: schemaql.resolvers(ogm, driver),
        plugins: {
            auth: new graphqlPluginAuth.Neo4jGraphQLAuthJWTPlugin({
                secret: process.env.GRAPHQL_SERVER_SECRET || '123456',
            })
        },
        config: {
            jwt: {
                secret: process.env.GRAPHQL_SERVER_SECRET || '123456',
            },
            auth: {
                isAuthenticated: true,
            },
        },
    })

    neoSchema.getSchema().then(async(schema) => {
        const server = new ApolloServer({
            context: ({
                req
            }) => {
                return {
                    driver,
                    driverConfig: {
                        database: process.env.NEO4J_DATABASE || 'neo4j'
                    },
                    req,
                }
            },
            schema: schema,
            introspection: true,
            //   playground: true,
        });
        server.start().then(res => {
            server.applyMiddleware({ app, path: '/' });
            app.listen({ port:4000 }, (url) => 
              console.log(`Gateway API running at port: ${4000}}`)
            );  
          });
        // await server.start()
        // server.applyMiddleware({ app });
        // app.listen({port:4000}).then(({
        //     url
        // }) => {
        //     console.log(`🚀 Server ready at ${url}`);
        // });
    })
})()