import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type, data }: ArgumentMetadata) {
    console.log("value", value);
    console.log("metatype", metatype);
    console.log("type", type);
    console.log("data", data);
    throw new BadRequestException('Validation failed');


   /* if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;*/
  }

  
}