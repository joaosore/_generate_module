import { inject, injectable } from 'tsyringe';
  import { IRoleRepository } from '../../repositories/Role/IRoleRepository';
  import { AppError } from '@config/AppError';
  import { sys_erros } from '@config/errors';
  import { SendError } from 'logs/Honeybadger';
  
  @injectable()
  class DeleteRoleUseCase {
    constructor(
      @inject('RoleRepository')
      private roleRepository: IRoleRepository,
    ) {}
  
    async execute(id: number): Promise<void> {
      const RoleExists = await this.roleRepository.findById(id);
  
      if (!RoleExists)  throw new AppError('Role already not exists', 404);
      
      try {
        await this.roleRepository.delete(id);
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }
    }
  }
  
  export { DeleteRoleUseCase };
  