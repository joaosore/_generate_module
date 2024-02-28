import { CreateRoleController } from '../useCases/create/CreateRoleController';
  import { DeleteRoleController } from '../useCases/delete/DeleteRoleController';
  import { FindRoleController } from '../useCases/find/FindRoleController';
  import { UpdateRoleController } from '../useCases/update/UpdateRoleController';

  /**
   * @swagger
   * /role:
   *      post:
   *          summary:
   *          security:
   *              - bearerAuth: []
   *          tags:
   *              - Role
   *          description: 
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              first_name:
   *                                  type: string
   *                                  example: Johnny
   *          responses:
   *              201:
   *                  description: Success
   *              401:
   *                  description: Unauthorized
   *              404:
   *                  description: Not found
   *              500:
   *                  description: Internal server error
   */
  const createRoleController = new CreateRoleController();
  /**
   * @swagger
   * /role/{id}:
   *      put:
   *          summary:
   *          parameters:
   *               - in: path
   *                 name: id
   *                 schema:
   *                   type: string
   *                 required: true
   *                 description: 
   *          security:
   *              - bearerAuth: []
   *          tags:
   *              - Role
   *          description:
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              first_name:
   *                                  type: string
   *                                  example: Johnny
   *          responses:
   *              200:
   *                  description: Success
   *              401:
   *                  description: Unauthorized
   *              404:
   *                  description: Not found
   *              500:
   *                  description: Internal server error
   */
  const updateRoleController = new UpdateRoleController();
  /**
   * @swagger
   * /role/{id}:
   *      delete:
   *          summary:
   *          parameters:
   *               - in: path
   *                 name: id
   *                 schema:
   *                   type: string
   *                 required: true
   *                 description:
   *          security:
   *              - bearerAuth: []
   *          tags:
   *              - Role
   *          description:
   *          responses:
   *              200:
   *                  description: Success
   *              404:
   *                  description: Not found
   *              500:
   *                  description: Internal server error
   */
  const deleteRoleController = new DeleteRoleController();
  /**
   * @swagger
   * /role:
   *      get:
   *          summary:
   *          security:
   *              - bearerAuth: []
   *          tags:
   *              - Role
   *          description:
   *          responses:
   *              201:
   *                  description: Success
   *              401:
   *                  description: Unauthorized
   *              404:
   *                  description: Not found
   *              500:
   *                  description: Internal server error
   */
  const findRoleController = new FindRoleController();

  const paths = [
    {
      method: 'GET',
      moduleByName: 'Role',
      url: '',
      handlers: findRoleController.handle,
      middlewares: [],
    },
    {
      method: 'POST',
      moduleByName: 'Role',
      url: '',
      handlers: createRoleController.handle,
      middlewares: [],
    },
    {
      method: 'PUT',
      moduleByName: 'Role',
      url: '/:id',
      handlers: updateRoleController.handle,
      middlewares: [],
    },
    {
      method: 'DELETE',
      moduleByName: 'Role',
      url: '/:id',
      handlers: deleteRoleController.handle,
      middlewares: [],
    },
  ];

  export default paths;
  