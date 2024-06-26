import { SetMetadata } from '@nestjs/common';

export const TYPEORM_EX_CUSTOM_REPOSITORY = Symbol('TYPEORM_EX_CUSTOM_REPOSITORY');

export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
