import { MagickWorkerInputs } from '../types';
import runPython from '../functions/ProcessPython';
let vm2;
// if process is not undefined, dynamically import vm2
if (typeof process !== 'undefined') {
  (async () => {
    vm2 = await import('vm2');
  })()
}

export async function processCode(
  code: unknown,
  inputs: MagickWorkerInputs,
  data: Record<string, any>,
  language = 'javascript'
) {
  // Inputs are flattened before we inject them for a better code experience
  const flattenInputs = Object.entries(inputs).reduce(
    (acc, [key, value]: [string, any]) => {
      acc[key] = value[0];
      return acc;
    },
    {} as Record<string, any>
  );

  if (language === 'javascript') {
    const { VM } = vm2;
    const vm = new VM();

    // Freeze the variables we are injecting into the VM
    vm.freeze(data, 'data');
    vm.freeze(flattenInputs, 'input');

    // run the code
    const codeToRun = `"use strict"; function runFn(input,data){ return (${code})(input,data)}; runFn(input,data);`;

    try {
      const codeResult = vm.run(codeToRun);
      console.log('CODE RESULT', codeResult);
      return codeResult;
    } catch (err) {
      console.log({ err });
      throw new Error(
        'Error in spell runner: processCode component: ' + code
      );
    }
  } else {
    try {

      const codeResult = await runPython(code, flattenInputs, data);
      return codeResult;
    } catch (err) {
      console.log({ err });
    }
  }
}
