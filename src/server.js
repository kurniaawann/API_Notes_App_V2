const Hapi = require("@hapi/hapi");
require("dotenv").config();
const ClientError = require("../src/exceptions/ClientError");
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

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
const CollaborationsService = require('./service/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./service/rabbitmq/ProductService');
const ExportsValidator = require('./validator/exports');

// uploads
// const uploads = require('./api/uploads');
const uploads = require('./api/uploads');
// const StorageService = require('./services/storage/StorageService');
const StorageService = require('./service/storage/StorageService');

const UploadsValidator = require('./validator/uploads');


const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  

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
    },
    {
      plugin: Inert,
    },
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
        validator: CollaborationsValidator,
      },
    },

    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
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
