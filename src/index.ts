import fs from 'fs/promises';

const getModule = () => {
  let text = process.argv.find(
    item => item.toLowerCase().indexOf('module=') > -1,
  );
  if (text) {
    let module = text.replace('module=', '');
    return module;
  }
};

const moduleName = getModule();
const dirs = ['dtos', 'entities', 'repositories', 'route', 'useCases'];

const CreateFile = (dir, content) => {
  fs.writeFile(dir, content);
};

const CreateDir = async dir => {
  await fs.mkdir(dir, { recursive: true });
};

const CreateDTOS = () => {
  const i_dto_module = `interface I${moduleName}DTO {} export { I${moduleName}DTO };`;
  const i_dto_create_module = `interface ICreate${moduleName}DTO {}export { ICreate${moduleName}DTO };
  `;
  const i_dto_update_module = `interface IUpdate${moduleName}DTO {}export { IUpdate${moduleName}DTO };
  `;

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/dtos/I${moduleName}DTO.ts`,
    i_dto_module,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/dtos/ICreate${moduleName}DTO.ts`,
    i_dto_create_module,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/dtos/IUpdate${moduleName}DTO.ts`,
    i_dto_update_module,
  );
};

const CreateEntities = () => {
  const entities = `
  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

  @Entity('${moduleName?.toLowerCase()}s')
  class ${moduleName} {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name_col: string;

    @Column({ type: 'datetime', default: () => 'GETDATA()' })
    created_at: Date;

    @Column({
      type: 'datetime',
      default: () => 'GETDATA()',
      onUpdate: 'GETDATA()',
    })
    updated_at: Date;

    constructor() {}
  }

  export { ${moduleName} };
  `;

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/entities/${moduleName}.ts`,
    entities,
  );
};

const CreateRepositories = async () => {
  const irepositories = `
  import { ICreate${moduleName}DTO } from '../../dtos/ICreate${moduleName}DTO';
  import { IUpdate${moduleName}DTO } from '../../dtos/IUpdate${moduleName}DTO';
  import { I${moduleName}DTO } from '../../dtos/I${moduleName}DTO';
  
  interface I${moduleName}Repository {
    create(data: ICreate${moduleName}DTO): Promise<void>;
    update(data: IUpdate${moduleName}DTO): Promise<void>;
    find(): Promise<I${moduleName}DTO[]>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<I${moduleName}DTO>;
  }
  
  export { I${moduleName}Repository };
  `;

  await CreateDir(
    `./tmp/${moduleName?.toLowerCase()}s/repositories/${moduleName}`,
  );

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/repositories/${moduleName}/I${moduleName}Repository.ts`,
    irepositories,
  );

  const repositories = `
  import { ICreate${moduleName}DTO } from '../../dtos/ICreate${moduleName}DTO';
  import { IUpdate${moduleName}DTO } from '../../dtos/IUpdate${moduleName}DTO';
  import { I${moduleName}DTO } from '../../dtos/I${moduleName}DTO';

  import { ${moduleName} } from '../../entities/${moduleName}';
  import { I${moduleName}Repository } from './I${moduleName}Repository';
  import { Repository, getRepository } from 'typeorm';

  class ${moduleName}Repository implements I${moduleName}Repository {
    private repository: Repository<${moduleName}>;

    constructor() {
      this.repository = getRepository(${moduleName});
    }

    async findById(id: number): Promise<I${moduleName}DTO> {
      return await this.repository.findOne({ id });
    }

    async create(data: ICreate${moduleName}DTO): Promise<void> {
      await this.repository.save(data);
    }
    async update(data: IUpdate${moduleName}DTO): Promise<void> {

      const id = data.id;
      delete data.id;

      await this.repository.update(id, data);
    }

    async find(): Promise<I${moduleName}DTO[]> {
      return await this.repository.find();
    }

    async delete(id: number): Promise<void> {
      await this.repository.delete(id);
    }
  }

  export { ${moduleName}Repository };
  `;

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/repositories/${moduleName}/${moduleName}Repository.ts`,
    repositories,
  );
};

const CreateRouts = () => {
  const index = `import paths from './paths';
  import { RegisterPaths } from '@routes/paths';
  
  const ${moduleName?.toLowerCase()}Routes = RegisterPaths({ paths });
  
  export { ${moduleName?.toLowerCase()}Routes };
  `;

  CreateFile(`./tmp/${moduleName?.toLowerCase()}s/route/index.ts`, index);

  const paths = `import { Create${moduleName}Controller } from '../useCases/create/Create${moduleName}Controller';
  import { Delete${moduleName}Controller } from '../useCases/delete/Delete${moduleName}Controller';
  import { Find${moduleName}Controller } from '../useCases/find/Find${moduleName}Controller';
  import { Update${moduleName}Controller } from '../useCases/update/Update${moduleName}Controller';

  /**
   * @swagger
   * /${moduleName?.toLowerCase()}:
   *      post:
   *          summary:
   *          security:
   *              - bearerAuth: []
   *          tags:
   *              - ${moduleName}
   *          description: 
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              first_name:
   *                                  type: string
   *                                  example: Johnny
   *          responses:
   *              201:
   *                  description: Success
   *              401:
   *                  description: Unauthorized
   *              404:
   *                  description: Not found
   *              500:
   *                  description: Internal server error
   */
  const create${moduleName}Controller = new Create${moduleName}Controller();
  /**
   * @swagger
   * /${moduleName?.toLowerCase()}/{id}:
   *      put:
   *          summary:
   *          parameters:
   *               - in: path
   *                 name: id
   *                 schema:
   *                   type: string
   *                 required: true
   *                 description: 
   *          security:
   *              - bearerAuth: []
   *          tags:
   *              - ${moduleName}
   *          description:
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          type: object
   *                          properties:
   *                              first_name:
   *                                  type: string
   *                                  example: Johnny
   *          responses:
   *              200:
   *                  description: Success
   *              401:
   *                  description: Unauthorized
   *              404:
   *                  description: Not found
   *              500:
   *                  description: Internal server error
   */
  const update${moduleName}Controller = new Update${moduleName}Controller();
  /**
   * @swagger
   * /${moduleName?.toLowerCase()}/{id}:
   *      delete:
   *          summary:
   *          parameters:
   *               - in: path
   *                 name: id
   *                 schema:
   *                   type: string
   *                 required: true
   *                 description:
   *          security:
   *              - bearerAuth: []
   *          tags:
   *              - ${moduleName}
   *          description:
   *          responses:
   *              200:
   *                  description: Success
   *              404:
   *                  description: Not found
   *              500:
   *                  description: Internal server error
   */
  const delete${moduleName}Controller = new Delete${moduleName}Controller();
  /**
   * @swagger
   * /${moduleName?.toLowerCase()}:
   *      get:
   *          summary:
   *          security:
   *              - bearerAuth: []
   *          tags:
   *              - ${moduleName}
   *          description:
   *          responses:
   *              201:
   *                  description: Success
   *              401:
   *                  description: Unauthorized
   *              404:
   *                  description: Not found
   *              500:
   *                  description: Internal server error
   */
  const find${moduleName}Controller = new Find${moduleName}Controller();

  const paths = [
    {
      method: 'GET',
      moduleByName: '${moduleName}',
      url: '',
      handlers: find${moduleName}Controller.handle,
      middlewares: [],
    },
    {
      method: 'POST',
      moduleByName: '${moduleName}',
      url: '',
      handlers: create${moduleName}Controller.handle,
      middlewares: [],
    },
    {
      method: 'PUT',
      moduleByName: '${moduleName}',
      url: '/:id',
      handlers: update${moduleName}Controller.handle,
      middlewares: [],
    },
    {
      method: 'DELETE',
      moduleByName: '${moduleName}',
      url: '/:id',
      handlers: delete${moduleName}Controller.handle,
      middlewares: [],
    },
  ];

  export default paths;
  `;

  CreateFile(`./tmp/${moduleName?.toLowerCase()}s/route/paths.ts`, paths);
};

const CreateUseCasas = async () => {
  const createController = `import { ICreate${moduleName}DTO } from '../../dtos/ICreate${moduleName}DTO';
  import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  
  import { Create${moduleName}UseCase } from './Create${moduleName}UseCase';
  
  class Create${moduleName}Controller {
    async handle(request: Request, response: Response): Promise<Response> {
      const data: ICreate${moduleName}DTO = request.body;
  
      const create${moduleName}UseCase = container.resolve(Create${moduleName}UseCase);
  
      await create${moduleName}UseCase.execute(data);
  
      return response.status(201).json();
    }
  }
  
  export { Create${moduleName}Controller };
  `;
  const createUseCase = `import { inject, injectable } from 'tsyringe';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { ICreate${moduleName}DTO } from '../../dtos/ICreate${moduleName}DTO';
  import { sys_erros } from '@config/errors';
  import { SendError } from 'logs/Honeybadger';
  import { AppError } from '@config/AppError';
  
  @injectable()
  class Create${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName?.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(data: ICreate${moduleName}DTO): Promise<void> {
      try {
        await this.${moduleName?.toLowerCase()}Repository.create(data);
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }
      
    }
  }
  
  export { Create${moduleName}UseCase };
  `;
  const createUseCaseTeste = `import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { Create${moduleName}UseCase } from './Create${moduleName}UseCase';
  import { getRepository } from 'typeorm';
  import { ${moduleName} } from '../../entities/${moduleName}';
  
  let XXXXX = '';
  describe('Crete ${moduleName}', () => {
    afterEach(() => {
      const ${moduleName?.toLocaleLowerCase()} = getRepository(${moduleName});
      ${moduleName?.toLocaleLowerCase()}.delete({});
    });
  
    it('should create a new ${moduleName?.toLocaleLowerCase()} when valid', async () => {
      const create${moduleName}UseCase = container.resolve(Create${moduleName}UseCase);
      expect(await create${moduleName}UseCase.execute({})).toEqual(
        undefined,
      );
    });
  
    it('should create a new user when is not valid XXXXX', async () => {
      const create${moduleName}UseCase = container.resolve(Create${moduleName}UseCase);
      try {
        await create${moduleName}UseCase.execute({});
      } catch (err) {
        expect(err.statusCode).toEqual(400);
      }
    });
  
    it('should create a new ${moduleName?.toLocaleLowerCase()} when is ${moduleName?.toLocaleLowerCase()} already exists', async () => {
      const ${moduleName?.toLocaleLowerCase()} = getRepository(${moduleName});
      await ${moduleName?.toLocaleLowerCase()}.save({});
  
      const create${moduleName}UseCase = container.resolve(Create${moduleName}UseCase);
      try {
        await create${moduleName}UseCase.execute({});
      } catch (err) {
        expect(err.statusCode).toEqual(400);
      }
    });
  });
  `;

  await CreateDir(`./tmp/${moduleName?.toLowerCase()}s/useCases/create`);

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/create/Create${moduleName}Controller.ts`,
    createController,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/create/Create${moduleName}UseCase.ts`,
    createUseCase,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/create/Create${moduleName}UseCase.test.ts`,
    createUseCaseTeste,
  );

  const deleteController = `import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  import { Delete${moduleName}UseCase } from './Delete${moduleName}UseCase';
  
  class Delete${moduleName}Controller {
    async handle(request: Request, response: Response): Promise<Response> {
      const { id } = request.params;
  
      const delete${moduleName}UseCase = container.resolve(Delete${moduleName}UseCase);
  
      await delete${moduleName}UseCase.execute(parseInt(id));
  
      return response.status(200).json();
    }
  }
  
  export { Delete${moduleName}Controller };
  `;
  const deleteUseCase = `import { inject, injectable } from 'tsyringe';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { AppError } from '@config/AppError';
  import { sys_erros } from '@config/errors';
  import { SendError } from 'logs/Honeybadger';
  
  @injectable()
  class Delete${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName?.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(id: number): Promise<void> {
      const ${moduleName}Exists = await this.${moduleName?.toLowerCase()}Repository.findById(id);
  
      if (!${moduleName}Exists)  throw new AppError('${moduleName} already not exists', 404);
      
      try {
        await this.${moduleName?.toLowerCase()}Repository.delete(id);
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }
    }
  }
  
  export { Delete${moduleName}UseCase };
  `;
  const deleteUseCaseTeste = `import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { getRepository } from 'typeorm';
  import { ${moduleName} } from '../../entities/${moduleName}';
  import { Delete${moduleName}UseCase } from './Delete${moduleName}UseCase';
  
  let id = 0;
  let XXXXX = '';
  describe('Delete ${moduleName}', () => {
    beforeEach(async () => {
      const ${moduleName?.toLowerCase()} = getRepository(${moduleName});
      const data = await ${moduleName?.toLowerCase()}.save({});
      id = data.id;
    });
  
    it('should delete a ${moduleName?.toLowerCase()} when given a valid id', async () => {
      const delete${moduleName}UseCase = container.resolve(Delete${moduleName}UseCase);
      expect(await delete${moduleName}UseCase.execute(id)).toEqual(undefined);
    });
  
    it('should throw an error when given an invalid id', async () => {
      const delete${moduleName}UseCase = container.resolve(Delete${moduleName}UseCase);
      try {
        await delete${moduleName}UseCase.execute(123456);
      } catch (err) {
        expect(err.statusCode).toEqual(404);
      }
    });
  });`;

  await CreateDir(`./tmp/${moduleName?.toLowerCase()}s/useCases/delete`);

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/delete/Delete${moduleName}Controller.ts`,
    deleteController,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/delete/Delete${moduleName}UseCase.ts`,
    deleteUseCase,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/delete/Delete${moduleName}UseCase.test.ts`,
    deleteUseCaseTeste,
  );

  const findController = `import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  import { Find${moduleName}UseCase } from './Find${moduleName}UseCase';
  
  class Find${moduleName}Controller {
    async handle(request: Request, response: Response): Promise<Response> {
      const find${moduleName}UseCase = container.resolve(Find${moduleName}UseCase);
  
      const ${moduleName}s = await find${moduleName}UseCase.execute();
  
      return response.status(200).json(${moduleName}s);
    }
  }
  
  export { Find${moduleName}Controller };
  `;
  const findUseCase = `import { I${moduleName}DTO } from '../../dtos/I${moduleName}DTO';
  import { inject, injectable } from 'tsyringe';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { SendError } from 'logs/Honeybadger';
  import { AppError } from '@config/AppError';
  import { sys_erros } from '@config/errors';

  @injectable()
  class Find${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName?.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(): Promise<I${moduleName}DTO[]> {
      try {
        return await this.${moduleName?.toLowerCase()}Repository.find();
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }
    }
  }
  
  export { Find${moduleName}UseCase };
  `;
  const findUseCaseTeste = `import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { getRepository } from 'typeorm';
  import { ${moduleName} } from '../../entities/${moduleName}';
  import { Find${moduleName}UseCase } from './Find${moduleName}UseCase';
  
  let XXXXX = 'teste@teste.com';
  
  describe('Find ${moduleName}', () => {
    beforeEach(async () => {
      const ${moduleName?.toLowerCase()} = getRepository(${moduleName});
      await ${moduleName?.toLowerCase()}.save({});
    });
    afterEach(async () => {
      const ${moduleName?.toLowerCase()} = getRepository(${moduleName});
      await ${moduleName?.toLowerCase()}.delete({});
    });
  
    it('should find all ${moduleName?.toLowerCase()}s', async () => {
      const find${moduleName}UseCase = container.resolve(Find${moduleName}UseCase);
  
      const response = await find${moduleName}UseCase.execute();
  
      expect(Array.isArray(response)).toBe(true);
  
      response.forEach(row => {
        expect(row).toHaveProperty('id');
        expect(typeof row.id).toBe('number');
      });
    });
  });`;

  await CreateDir(`./tmp/${moduleName?.toLowerCase()}s/useCases/find`);

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/find/Find${moduleName}Controller.ts`,
    findController,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/find/Find${moduleName}UseCase.ts`,
    findUseCase,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/find/Find${moduleName}UseCase.test.ts`,
    findUseCaseTeste,
  );

  const findByIdController = `import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  import { FindById${moduleName}UseCase } from './FindById${moduleName}UseCase';
  
  class FindById${moduleName}Controller {
    async handle(request: Request, response: Response): Promise<Response> {
      const { id } = request.params;
  
      const findById${moduleName}UseCase = container.resolve(FindById${moduleName}UseCase);
  
      const res = await findById${moduleName}UseCase.execute(parseInt(id));
  
      return response.status(200).json(res);
    }
  }
  
  export { FindById${moduleName}Controller };
  `;
  const findByIdUseCase = `import { inject, injectable } from 'tsyringe';
  import { I${moduleName}DTO } from '../../dtos/I${moduleName}DTO';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { AppError } from '@config/AppError';
  import { SendError } from 'logs/Honeybadger';
  import { sys_erros } from '@config/errors';
  
  @injectable()
  class FindById${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName?.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(id: number): Promise<I${moduleName}DTO> {
      const ${moduleName}Exists = await this.${moduleName?.toLowerCase()}Repository.findById(id);
  
      if (!${moduleName}Exists) throw new AppError('${moduleName} already not exists', 404);
      
      try {
        return await this.${moduleName?.toLowerCase()}Repository.findById(id);
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }
      
    }
  }
  
  export { FindById${moduleName}UseCase };
  `;
  const findByIdUseCaseTeste = `import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { getRepository } from 'typeorm';
  import { ${moduleName} } from '../../entities/${moduleName}';
  import { FindById${moduleName}UseCase } from './FindById${moduleName}UseCase';
  
  let id = 0;
  let XXXXX = '';
  describe('Find ${moduleName} by id', () => {
    beforeEach(async () => {
      const ${moduleName?.toLowerCase()} = getRepository(${moduleName});
      const data = await ${moduleName?.toLowerCase()}.save({});
      id = data.id;
    });
    afterEach(async () => {
      const ${moduleName?.toLowerCase()} = getRepository(${moduleName});
      await ${moduleName?.toLowerCase()}.delete({});
    });
  
    it('should find ${moduleName?.toLowerCase()}s', async () => {
      const findById${moduleName}UseCase = container.resolve(FindById${moduleName}UseCase);
      const row = await findById${moduleName}UseCase.execute(id);
      expect(row).toHaveProperty('id');
      expect(typeof row.id).toBe('number');
    });
  });
  `;

  await CreateDir(`./tmp/${moduleName?.toLowerCase()}s/useCases/findById`);

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/findById/FindById${moduleName}Controller.ts`,
    findByIdController,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/findById/FindById${moduleName}UseCase.ts`,
    findByIdUseCase,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/findById/FindById${moduleName}UseCase.test.ts`,
    findByIdUseCaseTeste,
  );

  const updateController = `import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  
  import { Update${moduleName}UseCase } from './Update${moduleName}UseCase';
  import { IUpdate${moduleName}DTO } from '../../dtos/IUpdate${moduleName}DTO';
  
  class Update${moduleName}Controller {
    async handle(request: Request, response: Response): Promise<Response> {
      const data: IUpdate${moduleName}DTO = request.body;
      const { id } = request.params;
  
      const update${moduleName}UseCase = container.resolve(Update${moduleName}UseCase);
  
      await update${moduleName}UseCase.execute({ id, ...data });
  
      return response.status(200).json();
    }
  }
  
  export { Update${moduleName}Controller };
  `;
  const updateUseCase = `import { inject, injectable } from 'tsyringe';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { AppError } from '@config/AppError';
  import { IUpdate${moduleName}DTO } from '../../dtos/IUpdate${moduleName}DTO';
  import { sys_erros } from '@config/errors';
  import { SendError } from 'logs/Honeybadger';
  
  @injectable()
  class Update${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName?.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(data: IUpdate${moduleName}DTO): Promise<void> {
      
      const ${moduleName}Exists = await this.${moduleName?.toLowerCase()}Repository.findById(data.id);
  
      if (!${moduleName}Exists) throw new AppError('${moduleName} already not exists', 404);
      
      try {
        await this.${moduleName?.toLowerCase()}Repository.update(data);
      } catch (err) {
        SendError(err);
        throw new AppError(sys_erros.SQL_ERROR, 400);
      }

    }
  }
  
  export { Update${moduleName}UseCase };
  `;
  const updateUseCaseTeste = `import { describe, expect } from '@jest/globals';
  import { container } from 'tsyringe';
  import { getRepository } from 'typeorm';
  import { ${moduleName} } from '../../entities/${moduleName}';
  import { Update${moduleName}UseCase } from './Update${moduleName}UseCase';
  
  let id = 0;
  let XXXXX = '';
  describe('Update ${moduleName}s', () => {
    beforeEach(async () => {
      const ${moduleName?.toLowerCase()} = getRepository(${moduleName});
      const data = await ${moduleName?.toLowerCase()}.save({});
      id = data.id;
    });
    afterEach(async () => {
      const ${moduleName?.toLowerCase()} = getRepository(${moduleName});
      await ${moduleName?.toLowerCase()}.delete({});
    });
  
    it('should update a ${moduleName?.toLowerCase()} when valid data is provided', async () => {
      const update${moduleName}UseCase = container.resolve(Update${moduleName}UseCase);
  
      try {
        await update${moduleName}UseCase.execute({});
      } catch (err) {
        expect(err.statusCode).toEqual(400);
      }
    });
  
    it('should throw an error when ${moduleName?.toLowerCase()} id does not exist', async () => {
      const update${moduleName}UseCase = container.resolve(Update${moduleName}UseCase);
  
      try {
        await update${moduleName}UseCase.execute({
          id: 1000000
        });
      } catch (err) {
        expect(err.statusCode).toEqual(404);
      }
    });
  });`;

  await CreateDir(`./tmp/${moduleName?.toLowerCase()}s/useCases/update`);

  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/update/Update${moduleName}Controller.ts`,
    updateController,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/update/Update${moduleName}UseCase.ts`,
    updateUseCase,
  );
  CreateFile(
    `./tmp/${moduleName?.toLowerCase()}s/useCases/update/Update${moduleName}UseCase.test.ts`,
    updateUseCaseTeste,
  );
};

const CreateModule = async () => {
  await Promise.all(
    dirs.map(async dir => {
      await fs.mkdir(`./tmp/${moduleName?.toLowerCase()}s/${dir}`, {
        recursive: true,
      });
    }),
  );
  CreateDTOS();
  CreateEntities();
  CreateRepositories();
  CreateRouts();
  CreateUseCasas();
};

CreateModule();
