import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from './serialize-interceptor';

interface ClassConstructor {
  new (...args: any[]);
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
