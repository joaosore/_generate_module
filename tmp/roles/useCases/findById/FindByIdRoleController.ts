import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  import { FindByIdRoleUseCase } from './FindByIdRoleUseCase';
  
  class FindByIdRoleController {
    async handle(request: Request, response: Response): Promise<Response> {
      const { id } = request.params;
  
      const findByIdRoleUseCase = container.resolve(FindByIdRoleUseCase);
  
      const res = await findByIdRoleUseCase.execute(parseInt(id));
  
      return response.status(200).json(res);
    }
  }
  
  export { FindByIdRoleController };
  