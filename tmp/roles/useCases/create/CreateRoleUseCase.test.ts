import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { CreateRoleUseCase } from './CreateRoleUseCase';
  import { getRepository } from 'typeorm';
  import { Role } from '../../entities/Role';
  
  let XXXXX = '';
  describe('Crete Role', () => {
    afterEach(() => {
      const role = getRepository(Role);
      role.delete({});
    });
  
    it('should create a new role when valid', async () => {
      const createRoleUseCase = container.resolve(CreateRoleUseCase);
      expect(await createRoleUseCase.execute({})).toEqual(
        undefined,
      );
    });
  
    it('should create a new user when is not valid XXXXX', async () => {
      const createRoleUseCase = container.resolve(CreateRoleUseCase);
      try {
        await createRoleUseCase.execute({});
      } catch (err) {
        expect(err.statusCode).toEqual(400);
      }
    });
  
    it('should create a new role when is role already exists', async () => {
      const role = getRepository(Role);
      await role.save({});
  
      const createRoleUseCase = container.resolve(CreateRoleUseCase);
      try {
        await createRoleUseCase.execute({});
      } catch (err) {
        expect(err.statusCode).toEqual(400);
      }
    });
  });
  