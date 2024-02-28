import { inject, injectable } from 'tsyringe';
  import { IRoleRepository } from '../../repositories/Role/IRoleRepository';
  import { ICreateRoleDTO } from '../../dtos/ICreateRoleDTO';
  import { sys_erros } from '@config/errors';
  import { SendError } from 'logs/Honeybadger';
  import { AppError } from '@config/AppError';
  
  @injectable()
  class CreateRoleUseCase {
    constructor(
      @inject('RoleRepository')
      private roleRepository: IRoleRepository,
    ) {}
  
    async execute(data: ICreateRoleDTO): Promise<void> {
      try {
        await this.roleRepository.create(data);
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }
      
    }
  }
  
  export { CreateRoleUseCase };
  