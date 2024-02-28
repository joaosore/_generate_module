
  import { ICreateRoleDTO } from '../../dtos/ICreateRoleDTO';
  import { IUpdateRoleDTO } from '../../dtos/IUpdateRoleDTO';
  import { IRoleDTO } from '../../dtos/IRoleDTO';
  
  interface IRoleRepository {
    create(data: ICreateRoleDTO): Promise<void>;
    update(data: IUpdateRoleDTO): Promise<void>;
    find(): Promise<IRoleDTO[]>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<IRoleDTO>;
  }
  
  export { IRoleRepository };
  