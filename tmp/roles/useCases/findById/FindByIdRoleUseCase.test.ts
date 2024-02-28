import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { getRepository } from 'typeorm';
  import { Role } from '../../entities/Role';
  import { FindByIdRoleUseCase } from './FindByIdRoleUseCase';
  
  let id = 0;
  let XXXXX = '';
  describe('Find Role by id', () => {
    beforeEach(async () => {
      const role = getRepository(Role);
      await role.save({});
    });
    afterEach(async () => {
      const role = getRepository(Role);
      await role.delete({});
    });
  
    it('should find roles', async () => {
      const findByIdRoleUseCase = container.resolve(FindByIdRoleUseCase);
      const response = await findByIdRoleUseCase.execute(id);
      expect(response).toHaveProperty('id');
      expect(typeof response.id).toBe('number');
    });
  });
  