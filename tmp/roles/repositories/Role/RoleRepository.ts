
  import { ICreateRoleDTO } from '../../dtos/ICreateRoleDTO';
  import { IUpdateRoleDTO } from '../../dtos/IUpdateRoleDTO';
  import { IRoleDTO } from '../../dtos/IRoleDTO';

  import { Role } from '../../entities/Role';
  import { IRoleRepository } from './IRoleRepository';
  import { Repository, getRepository } from 'typeorm';

  class RoleRepository implements IRoleRepository {
    private repository: Repository<Role>;

    constructor() {
      this.repository = getRepository(Role);
    }

    async findById(id: number): Promise<IRoleDTO> {
      return await this.repository.findOne({ id });
    }

    async create(data: ICreateRoleDTO): Promise<void> {
      await this.repository.save(data);
    }
    async update(data: IUpdateRoleDTO): Promise<void> {

      const id = data.id;
      delete data.id;

      await this.repository.update(id, data);
    }

    async find(): Promise<IRoleDTO[]> {
      return await this.repository.find();
    }

    async delete(id: number): Promise<void> {
      await this.repository.delete(id);
    }
  }

  export { RoleRepository };
  