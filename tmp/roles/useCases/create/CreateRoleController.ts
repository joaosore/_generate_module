import { ICreateRoleDTO } from '../../dtos/ICreateRoleDTO';
  import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  
  import { CreateRoleUseCase } from './CreateRoleUseCase';
  
  class CreateRoleController {
    async handle(request: Request, response: Response): Promise<Response> {
      const data: ICreateRoleDTO = request.body;
  
      const createRoleUseCase = container.resolve(CreateRoleUseCase);
  
      await createRoleUseCase.execute(data);
  
      return response.status(201).json();
    }
  }
  
  export { CreateRoleController };
  