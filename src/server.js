const Hapi = require("@hapi/hapi");
require("dotenv").config();
const ClientError = require("../src/exceptions/ClientError");

// notes
const notes = require('./api/notes');
const NotesService = require("./service/postgres/NotesService");
const NotesValidator = require('./validator/notes');
//users
const users = require('./api/users');
const UsersService = require('./service/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {

  
  const notesService = new NotesService();
  const usersService = new UsersService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

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
      console.log(`ini response message${response.message}`);
      // console.log(`ini h.continue${h.continue}`);
      console.log(`ini request${response.statusCode}`);

      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
