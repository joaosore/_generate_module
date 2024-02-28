import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  import { FindRoleUseCase } from './FindRoleUseCase';
  
  class FindRoleController {
    async handle(request: Request, response: Response): Promise<Response> {
      const findRoleUseCase = container.resolve(FindRoleUseCase);
  
      const Roles = await findRoleUseCase.execute();
  
      return response.status(200).json(Roles);
    }
  }
  
  export { FindRoleController };
  