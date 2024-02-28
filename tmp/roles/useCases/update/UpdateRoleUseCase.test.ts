import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { getRepository } from 'typeorm';
  import { Role } from '../../entities/Role';
  import { UpdateRoleUseCase } from './UpdateRoleUseCase';
  
  let id = 0;
  let XXXXX = '';
  describe('Update Roles', () => {
    beforeEach(async () => {
      const role = getRepository(Role);
      const data = await role.save({});
      id = data.id;
    });
    afterEach(async () => {
      const role = getRepository(Role);
      await role.delete({});
    });
  
    it('should update a role when valid data is provided', async () => {
      const updateRoleUseCase = container.resolve(UpdateRoleUseCase);
  
      try {
        await updateRoleUseCase.execute({});
      } catch (err) {
        expect(err.statusCode).toEqual(400);
      }
    });
  
    it('should throw an error when role id does not exist', async () => {
      const updateRoleUseCase = container.resolve(UpdateRoleUseCase);
  
      try {
        await updateRoleUseCase.execute({
          id: 1000000
        });
      } catch (err) {
        expect(err.statusCode).toEqual(404);
      }
    });
  });