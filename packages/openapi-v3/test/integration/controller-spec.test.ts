import {expect} from '@loopback/testlab';
import {model, property} from '@loopback/repository';
import {ParameterObject, SchemasObject} from '@loopback/openapi-v3-types';
import {param, requestBody, getControllerSpec, post} from '../../';

describe('controller spec', () => {
  it('adds property schemas in components.schemas', () => {
    @model()
    class Bar {
      @property() name: string;
    }

    @model()
    class Baz {
      @property() name: string;
    }

    @model()
    class Foo {
      @property() bar: Bar;
      @property() baz: Baz;
    }

    class FooController {
      @post('/foo')
      create(
        @requestBody({name: 'foo', in: 'query'})
        foo: Foo,
      ): void {}
    }

    const expectedSpec = {
      paths: {
        '/foo': {
          post: {
            responses: {},
            requestBody: {
              name: 'foo',
              in: 'query',
              content: {
                'application/json': {
                  schema: {$ref: '#/components/schemas/Foo'},
                },
              },
            },
            'x-operation-name': 'create',
          },
        },
      },
      components: {
        schemas: {
          Bar: {title: 'Bar', properties: {name: {type: 'string'}}},
          Baz: {title: 'Baz', properties: {name: {type: 'string'}}},
          Foo: {
            // guarantee `definition` is deleted
            title: 'Foo',
            properties: {
              bar: {$ref: '#/components/schemas/Bar'},
              baz: {$ref: '#/components/schemas/Baz'},
            },
          },
        },
      },
    };

    expect(getControllerSpec(FooController)).to.eql(expectedSpec);
  });
  it('does not produce nested definitions', () => {
    const paramSpec: ParameterObject = {
      name: 'foo',
      in: 'query',
    };
    @model()
    class Foo {
      @property() bar: number;
    }
    @model()
    class MyParam {
      @property() name: string;
      @property() foo: Foo;
    }
    class MyController {
      @post('/foo')
      foo(@param(paramSpec) body: MyParam) {}
    }

    const schemas = (getControllerSpec(MyController).components || {})
      .schemas as SchemasObject;
    expect(schemas).to.have.keys('MyParam', 'Foo');
    expect(schemas.MyParam).to.not.have.key('definitions');
  });
  it('infers no properties if no property metadata is present', () => {
    const paramSpec: ParameterObject = {
      name: 'foo',
      in: 'query',
    };
    @model()
    class MyParam {
      name: string;
    }
    class MyController {
      @post('/foo')
      foo(@param(paramSpec) foo: MyParam) {}
    }

    const schemas = (getControllerSpec(MyController).components || {})
      .schemas as SchemasObject;

    expect(schemas).to.have.key('MyParam');
    expect(schemas.MyParam).to.not.have.key('properties');
  });

  it('does not infer definition if no class metadata is present', () => {
    const paramSpec: ParameterObject = {
      name: 'foo',
      in: 'query',
    };
    class MyParam {
      @property() name: string;
    }
    class MyController {
      @post('/foo')
      foo(@param(paramSpec) foo: MyParam) {}
    }

    const schemas = (getControllerSpec(MyController).components || {})
      .schemas as SchemasObject;

    expect(schemas).to.have.key('MyParam');
    expect(schemas.MyParam).to.deepEqual({});
  });
});
