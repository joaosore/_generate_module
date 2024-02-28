import { inject, injectable } from 'tsyringe';
  import { IRoleRepository } from '../../repositories/Role/IRoleRepository';
  import { AppError } from '@config/AppError';
  import { IUpdateRoleDTO } from '../../dtos/IUpdateRoleDTO';
  import { sys_erros } from '@config/errors';
  import { SendError } from 'logs/Honeybadger';
  
  @injectable()
  class UpdateRoleUseCase {
    constructor(
      @inject('RoleRepository')
      private roleRepository: IRoleRepository,
    ) {}
  
    async execute(data: IUpdateRoleDTO): Promise<void> {
      
      const RoleExists = await this.roleRepository.findById(data.id);
  
      if (!RoleExists) throw new AppError('Role already not exists', 404);
      
      try {
        await this.roleRepository.update(data);
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }

    }
  }
  
  export { UpdateRoleUseCase };
  