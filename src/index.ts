import fs from 'fs/promises';

const getModule = () => {
  let text = process.argv.find(
    (item) => item.toLowerCase().indexOf('module=') > -1
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

const CreateDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const CreateDTOS = () => {
  const i_dto_module = `interface I${moduleName}DTO {} export { I${moduleName}DTO };`;
  const i_dto_create_module = `interface ICreate${moduleName}DTO {}export { ICreate${moduleName}DTO };
  `;
  const i_dto_update_module = `interface IUpdate${moduleName}DTO {}export { IUpdate${moduleName}DTO };
  `;

  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/dtos/I${moduleName}DTO.ts`,
    i_dto_module
  );
  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/dtos/ICreate${moduleName}DTO.ts`,
    i_dto_create_module
  );
  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/dtos/IUpdate${moduleName}DTO.ts`,
    i_dto_update_module
  );
};

const CreateEntities = () => {
  const entities = `
  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

  @Entity('${moduleName.toLowerCase()}s')
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
    `./tmp/${moduleName.toLowerCase()}s/entities/${moduleName}.ts`,
    entities
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
    `./tmp/${moduleName.toLowerCase()}s/repositories/${moduleName}`
  );

  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/repositories/${moduleName}/I${moduleName}Repository.ts`,
    irepositories
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
    `./tmp/${moduleName.toLowerCase()}s/repositories/${moduleName}/${moduleName}Repository.ts`,
    repositories
  );
};

const CreateRouts = () => {
  const index = `import paths from './paths';
  import { RegisterPaths } from '@routes/paths';
  
  const ${moduleName.toLowerCase()}Routes = RegisterPaths({ paths });
  
  export { ${moduleName.toLowerCase()}Routes };
  `;

  CreateFile(`./tmp/${moduleName.toLowerCase()}s/route/index.ts`, index);

  const paths = `import { Authenticated } from '@middleware/Authenticated';
  import { Create${moduleName}Controller } from '../useCases/create/Create${moduleName}Controller';
  import { Delete${moduleName}Controller } from '../useCases/delete/Delete${moduleName}Controller';
  import { Find${moduleName}Controller } from '../useCases/find/Find${moduleName}Controller';
  import { Update${moduleName}Controller } from '../useCases/update/Update${moduleName}Controller';

  /**
   * @swagger
   * /${moduleName.toLowerCase()}:
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
   * /${moduleName.toLowerCase()}/{id}:
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
   * /${moduleName.toLowerCase()}/{id}:
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
   * /${moduleName.toLowerCase()}:
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

  CreateFile(`./tmp/${moduleName.toLowerCase()}s/route/paths.ts`, paths);
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
  
      return response.status(201).send();
    }
  }
  
  export { Create${moduleName}Controller };
  `;
  const createUseCase = `import { inject, injectable } from 'tsyringe';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { ICreate${moduleName}DTO } from '../../dtos/ICreate${moduleName}DTO';
  
  @injectable()
  class Create${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(data: ICreate${moduleName}DTO): Promise<void> {
      await this.${moduleName.toLowerCase()}Repository.create(data);
    }
  }
  
  export { Create${moduleName}UseCase };
  `;

  await CreateDir(`./tmp/${moduleName.toLowerCase()}s/useCases/create`);

  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/create/Create${moduleName}Controller.ts`,
    createController
  );
  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/create/Create${moduleName}UseCase.ts`,
    createUseCase
  );

  const deleteController = `import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  import { Delete${moduleName}UseCase } from './Delete${moduleName}UseCase';
  
  class Delete${moduleName}Controller {
    async handle(request: Request, response: Response): Promise<Response> {
      const { id } = request.params;
  
      const delete${moduleName}UseCase = container.resolve(Delete${moduleName}UseCase);
  
      await delete${moduleName}UseCase.execute(parseInt(id));
  
      return response.status(200).send();
    }
  }
  
  export { Delete${moduleName}Controller };
  `;
  const deleteUseCase = `import { inject, injectable } from 'tsyringe';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { AppError } from '@config/AppError';
  
  @injectable()
  class Delete${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(id: number): Promise<void> {
      const ${moduleName}AlreadyNotExists = await this.${moduleName.toLowerCase()}Repository.findById(id);
  
      if (!${moduleName}AlreadyNotExists) {
        throw new AppError('${moduleName} already not exists', 404);
      }
  
      await this.${moduleName.toLowerCase()}Repository.delete(id);
    }
  }
  
  export { Delete${moduleName}UseCase };
  `;

  await CreateDir(`./tmp/${moduleName.toLowerCase()}s/useCases/delete`);

  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/delete/Delete${moduleName}Controller.ts`,
    deleteController
  );
  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/delete/Delete${moduleName}UseCase.ts`,
    deleteUseCase
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
  
  @injectable()
  class Find${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(): Promise<I${moduleName}DTO[]> {
      return await this.${moduleName.toLowerCase()}Repository.find();
    }
  }
  
  export { Find${moduleName}UseCase };
  `;

  await CreateDir(`./tmp/${moduleName.toLowerCase()}s/useCases/find`);

  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/find/Find${moduleName}Controller.ts`,
    findController
  );
  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/find/Find${moduleName}UseCase.ts`,
    findUseCase
  );

  const findByIdController = `import { Request, Response } from 'express';
  import { container } from 'tsyringe';
  import { FindById${moduleName}UseCase } from './FindById${moduleName}UseCase';
  
  class FindById${moduleName}Controller {
    async handle(request: Request, response: Response): Promise<Response> {
      const { id } = request.params;
  
      const findById${moduleName}UseCase = container.resolve(FindById${moduleName}UseCase);
  
      await findById${moduleName}UseCase.execute(parseInt(id));
  
      return response.status(200).send();
    }
  }
  
  export { FindById${moduleName}Controller };
  `;
  const findByIdUseCase = `import { inject, injectable } from 'tsyringe';
  import { I${moduleName}DTO } from '../../dtos/I${moduleName}DTO';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { AppError } from '@config/AppError';
  
  @injectable()
  class FindById${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(id: number): Promise<I${moduleName}DTO | null> {
      const ${moduleName}AlreadyNotExists = await this.${moduleName.toLowerCase()}Repository.findById(id);
  
      if (!${moduleName}AlreadyNotExists) {
        throw new AppError('${moduleName} already not exists', 404);
      }
  
      return await this.${moduleName.toLowerCase()}Repository.findById(id);
    }
  }
  
  export { FindById${moduleName}UseCase };
  `;

  await CreateDir(`./tmp/${moduleName.toLowerCase()}s/useCases/findById`);

  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/findById/FindById${moduleName}Controller.ts`,
    findByIdController
  );
  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/findById/FindById${moduleName}UseCase.ts`,
    findByIdUseCase
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
  
      return response.status(200).send();
    }
  }
  
  export { Update${moduleName}Controller };
  `;
  const updateUseCase = `import { inject, injectable } from 'tsyringe';
  import { I${moduleName}Repository } from '../../repositories/${moduleName}/I${moduleName}Repository';
  import { AppError } from '@config/AppError';
  import { IUpdate${moduleName}DTO } from '../../dtos/IUpdate${moduleName}DTO';
  
  @injectable()
  class Update${moduleName}UseCase {
    constructor(
      @inject('${moduleName}Repository')
      private ${moduleName.toLowerCase()}Repository: I${moduleName}Repository,
    ) {}
  
    async execute(data: IUpdate${moduleName}DTO): Promise<void> {
      
      const ${moduleName}AlreadyNotExists = await this.${moduleName.toLowerCase()}Repository.findById(data.id);
  
      if (!${moduleName}AlreadyNotExists) {
        throw new AppError('${moduleName} already not exists', 404);
      }
  
      await this.${moduleName.toLowerCase()}Repository.update(data);
    }
  }
  
  export { Update${moduleName}UseCase };
  `;

  await CreateDir(`./tmp/${moduleName.toLowerCase()}s/useCases/update`);

  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/update/Update${moduleName}Controller.ts`,
    updateController
  );
  CreateFile(
    `./tmp/${moduleName.toLowerCase()}s/useCases/update/Update${moduleName}UseCase.ts`,
    updateUseCase
  );
};

const CreateModule = async () => {
  await Promise.all(
    dirs.map(async (dir) => {
      await fs.mkdir(`./tmp/${moduleName.toLowerCase()}s/${dir}`, {
        recursive: true,
      });
    })
  );
  CreateDTOS();
  CreateEntities();
  CreateRepositories();
  CreateRouts();
  CreateUseCasas();
};

CreateModule();
