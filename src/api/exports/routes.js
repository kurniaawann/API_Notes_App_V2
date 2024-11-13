const routes = (handler) => [
    {
      method: 'POST',
      path: '/export/notes',
      handler: handler.postExportNotesHandler,
      options: {
        auth: 'notes_jwt',
      },
    },
  ];
   
  module.exports = routes;