import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

export default function MongooseClassSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      console.log(1111, document);

      if (!(document instanceof Document)) {
        return document;
      }
      return plainToClass(classToIntercept, document.toJSON(), {
        excludePrefixes: ['_'],
      });
    }

    private prepareResponse(
      response:
        | PlainLiteralObject
        | PlainLiteralObject[]
        | {
            items: PlainLiteralObject[];
            count: number;
            next_key: Object;
          },
    ) {
      if (!Array.isArray(response) && response?.items) {
        console.log(2222, response);

        const items = this.prepareResponse(response.items);
        return {
          count: response?.count,
          items,
          next_key: response?.next_key,
        };
      }

      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
