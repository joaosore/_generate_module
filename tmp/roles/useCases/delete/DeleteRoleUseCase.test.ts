import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { getRepository } from 'typeorm';
  import { Role } from '../../entities/Role';
  import { DeleteRoleUseCase } from './DeleteRoleUseCase';
  
  let id = 0;
  let XXXXX = '';
  describe('Delete Role', () => {
    beforeEach(async () => {
      const role = getRepository(Role);
      const data = await role.save({});
      id = data.id;
    });
  
    it('should delete a role when given a valid id', async () => {
      const deleteRoleUseCase = container.resolve(DeleteRoleUseCase);
      expect(await deleteRoleUseCase.execute(id)).toEqual(undefined);
    });
  
    it('should throw an error when given an invalid id', async () => {
      const deleteRoleUseCase = container.resolve(DeleteRoleUseCase);
      try {
        await deleteRoleUseCase.execute(123456);
      } catch (err) {
        expect(err.statusCode).toEqual(404);
      }
    });
  });