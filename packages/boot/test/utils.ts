// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/boot
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {TestSandbox} from '@loopback/testlab';

export async function resetSandbox(sandbox: TestSandbox) {
  await sandbox.reset();
}
