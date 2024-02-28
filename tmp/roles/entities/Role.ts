
  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

  @Entity('roles')
  class Role {
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

  export { Role };
  