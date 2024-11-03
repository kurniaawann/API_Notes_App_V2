const routes = (handler) => [
    {
      method: 'POST',
      path: '/collaborations',
      handler: handler.postCollaborationHandler,
      options: {
        auth: 'notes_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/collaborations',
      handler: handler.deleteCollaborationHandler,
      options: {
        auth: 'notes_jwt',
      },
    },
  ];
   
  module.exports = routes;