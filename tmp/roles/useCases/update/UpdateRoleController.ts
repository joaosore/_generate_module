import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  
  import { UpdateRoleUseCase } from './UpdateRoleUseCase';
  import { IUpdateRoleDTO } from '../../dtos/IUpdateRoleDTO';
  
  class UpdateRoleController {
    async handle(request: Request, response: Response): Promise<Response> {
      const data: IUpdateRoleDTO = request.body;
      const { id } = request.params;
  
      const updateRoleUseCase = container.resolve(UpdateRoleUseCase);
  
      await updateRoleUseCase.execute({ id, ...data });
  
      return response.status(200).json();
    }
  }
  
  export { UpdateRoleController };
  