import {
  ControllerSpec,
  post,
  requestBody,
  getControllerSpec,
} from '../../../../../';
import {ContentObject, SchemaObject} from '@loopback/openapi-v3-types';
import {Class} from '@loopback/repository';
import {expect} from '@loopback/testlab';

// I will add all shortcut decorators if we think they are valuable
// considering we are changing to DI soon
describe('requestBody decorator', () => {
  context('array', () => {});
  context('infers request body with primative type - ', () => {
    let actualSpec: ControllerSpec;
    let expectedContent: ContentObject;

    it('number', () => {
      class MyController {
        @post('/greeting')
        greet(@requestBody() name: number) {}
      }
      givenControllerMethod({type: 'number'}, MyController);
    });

    it('string', () => {
      class MyController {
        @post('/greeting')
        greet(@requestBody() name: string) {}
      }
      givenControllerMethod({type: 'string'}, MyController);
    });

    it('boolean', () => {
      class MyController {
        @post('/greeting')
        greet(@requestBody() name: boolean) {}
      }
      givenControllerMethod({type: 'boolean'}, MyController);
    });

    it('object', () => {
      class MyController {
        @post('/greeting')
        greet(@requestBody() name: object) {}
      }
      givenControllerMethod({type: 'object'}, MyController);
    });

    it('array', () => {
      class MyController {
        @post('/greeting')
        greet(@requestBody() name: string[]) {}
      }
      givenControllerMethod({type: 'array'}, MyController);
    });

    function givenControllerMethod(
      expectedSchemaSpec: SchemaObject,
      controller: Class<{}>,
    ) {
      actualSpec = getControllerSpec(controller);
      expectedContent = {
        'application/json': {
          schema: expectedSchemaSpec,
        },
      };
      expect(actualSpec.paths['/greeting']['post'].requestBody.content).to.eql(
        expectedContent,
      );
    }
  });
});
