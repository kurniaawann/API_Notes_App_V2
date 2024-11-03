const Hapi = require("@hapi/hapi");
require("dotenv").config();
const ClientError = require("../src/exceptions/ClientError");
const Jwt = require('@hapi/jwt')

// notes
const notes = require('./api/notes');
const NotesService = require("./service/postgres/NotesService");
const NotesValidator = require('./validator/notes');

//users
const users = require('./api/users');
const UsersService = require('./service/postgres/UsersService');
const UsersValidator = require('./validator/users');

//Authentication
const authentications = require('./api/authentications');
const AuthenticationsService = require('./service/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

//collaborations
const collaborations = require('./api/collaborations');
const collaborationsValidator = require('./validator/collaborations');
const CollaborationsService = require("./service/postgres/CollaborationsService");


const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  
  //register plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    }
  ]);

  //mendefinisikan strategy authentikasi jwt
  server.auth.strategy('notes_jwt', 'jwt', {
    keys:process.env.ACCESS_TOKEN_KEY,
    verify:{
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec:process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts)=> ({
      isValid:true,
      credential:{
        id:artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: notes,
      options: {
      service: notesService,
      validator: NotesValidator,
      },
      
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },

    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: collaborationsValidator,
      },
    },
  ]);


  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
