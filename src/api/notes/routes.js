const routes = (handler) => [
  {
    method: "POST",
    path: "/notes",
    handler: handler.postNoteHandler,
    options: {
      auth: 'notes_jwt',
    },

  },
  {
    method: "GET",
    path: "/notes",
    handler: handler.getNotesHandler,
    options: {
      auth: 'notes_jwt',
    },

  },
  {
    method: "GET",
    path: "/notes/{id}",
    handler: handler.getNoteByIdHandler,
    options: {
      auth: 'notes_jwt',
    },

  },
  {
    method: "PUT",
    path: "/notes/{id}",
    handler: handler.putNoteByIdHandler,
    options: {
      auth: 'notes_jwt',
    },

  },
  {
    method: "DELETE",
    path: "/notes/{id}",
    handler: handler.deleteNoteByIdHandler,
    options: {
      auth: 'notes_jwt',
    },

  },
];

module.exports = routes;
