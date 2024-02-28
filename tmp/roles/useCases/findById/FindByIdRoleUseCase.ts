import { inject, injectable } from 'tsyringe';
  import { IRoleDTO } from '../../dtos/IRoleDTO';
  import { IRoleRepository } from '../../repositories/Role/IRoleRepository';
  import { AppError } from '@config/AppError';
  import { SendError } from 'logs/Honeybadger';
  import { sys_erros } from '@config/errors';
  
  @injectable()
  class FindByIdRoleUseCase {
    constructor(
      @inject('RoleRepository')
      private roleRepository: IRoleRepository,
    ) {}
  
    async execute(id: number): Promise<IRoleDTO> {
      const RoleExists = await this.roleRepository.findById(id);
  
      if (!RoleExists) throw new AppError('Role already not exists', 404);
      
      try {
        return await this.roleRepository.findById(id);
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }
      
    }
  }
  
  export { FindByIdRoleUseCase };
  