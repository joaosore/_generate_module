import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { getRepository } from 'typeorm';
  import { Role } from '../../entities/Role';
  import { FindRoleUseCase } from './FindRoleUseCase';
  
  let XXXXX = 'teste@teste.com';
  
  describe('Find Role', () => {
    beforeEach(async () => {
      const role = getRepository(Role);
      await role.save({});
    });
    afterEach(async () => {
      const role = getRepository(Role);
      await role.delete({});
    });
  
    it('should find all roles', async () => {
      const findRoleUseCase = container.resolve(FindRoleUseCase);
  
      const response = await findRoleUseCase.execute();
  
      expect(Array.isArray(response)).toBe(true);
  
      response.forEach(role => {
        expect(role).toHaveProperty('id');
        expect(role).toHaveProperty('name');
        expect(role).toHaveProperty('email');
        expect(role).toHaveProperty('password');
        expect(typeof role.id).toBe('number');
        expect(typeof role.name).toBe('string');
        expect(typeof role.email).toBe('string');
        expect(typeof role.password).toBe('string');
      });
    });
  });