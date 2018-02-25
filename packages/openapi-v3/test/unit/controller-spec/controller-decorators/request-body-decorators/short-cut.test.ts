import {expect} from '@loopback/testlab';
import {getControllerSpec, requestBody, post} from '../../../../../';

describe('requestBody decorator - shortcuts', () => {
  context('array', () => {
    it('', () => {
      const description = 'an array of names';
      class MyController {
        @post('/greeting')
        greet(
          @requestBody.array(
            {type: 'string'},
            {description: description, required: false},
          )
          name: string[],
        ) {}
      }

      const actualSpec = getControllerSpec(MyController);
      const expectedContent = {
        'application/json': {
          schema: {
            type: 'array',
            items: {type: 'string'},
          },
        },
      };

      expect(
        actualSpec.paths['/greeting']['post'].requestBody.description,
      ).to.eql(description);
      expect(actualSpec.paths['/greeting']['post'].requestBody.required).to.eql(
        false,
      );
      expect(actualSpec.paths['/greeting']['post'].requestBody.content).to.eql(
        expectedContent,
      );
    });
  });
});
