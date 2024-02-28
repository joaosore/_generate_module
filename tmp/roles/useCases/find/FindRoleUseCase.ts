import { IRoleDTO } from '../../dtos/IRoleDTO';
  import { inject, injectable } from 'tsyringe';
  import { IRoleRepository } from '../../repositories/Role/IRoleRepository';
  import { SendError } from 'logs/Honeybadger';
  import { AppError } from '@config/AppError';
  import { sys_erros } from '@config/errors';

  @injectable()
  class FindRoleUseCase {
    constructor(
      @inject('RoleRepository')
      private roleRepository: IRoleRepository,
    ) {}
  
    async execute(): Promise<IRoleDTO[]> {
      try {
        return await this.roleRepository.find();
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }
    }
  }
  
  export { FindRoleUseCase };
  