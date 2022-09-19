import { Spell } from '../src/types'

export default {
  id: '3b7add2b-0f49-4c6b-8db9-18ecbb34602c',
  name: 'ridiculous orange',
  graph: {
    id: 'demo@0.1.0',
    nodes: {
      '124': {
        id: 124,
        data: {
          name: 'default',
          error: false,
          socketKey: '20c0d2db-1916-433f-88c6-69d3ae123217',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            playtestToggle: { expanded: true },
          },
          playtestToggle: { receivePlaytest: true },
          success: false,
        },
        inputs: {},
        outputs: {
          trigger: {
            connections: [{ node: 763, input: 'trigger', data: { pins: [] } }],
          },
        },
        position: [-1556.5668566017482, -114.13292905935491],
        name: 'Module Trigger In',
      },
      '233': {
        id: 233,
        data: {
          name: 'output',
          error: false,
          display: 'test',
          socketKey: 'ba6ed95b-3aac-49e9-91ae-a33f5510c83b',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            sendToPlaytest: { expanded: true },
          },
          sendToPlaytest: true,
          success: false,
        },
        inputs: {
          input: {
            connections: [{ node: 764, output: 'input', data: { pins: [] } }],
          },
          trigger: {
            connections: [{ node: 764, output: 'trigger', data: { pins: [] } }],
          },
        },
        outputs: { trigger: { connections: [] } },
        position: [-362.4726875921044, -309.7961029517374],
        name: 'Output',
      },
      '646': {
        id: 646,
        data: {
          name: 'input',
          text: 'test',
          socketKey: '3a9cfde5-32a0-4e96-9de7-7571a7a4e784',
          nodeLocked: true,
          dataControls: {
            name: { expanded: true },
            useDefault: { expanded: true },
            playtestToggle: { expanded: true },
          },
          playtestToggle: { receivePlaytest: true },
          display: 'test',
          success: false,
        },
        inputs: {},
        outputs: {
          output: {
            connections: [{ node: 763, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-1555.1553378286703, -376.7788066492969],
        name: 'Universal Input',
      },
      '763': {
        id: 763,
        data: {
          dataControls: { inputs: { expanded: true } },
          inputs: [
            {
              name: 'input',
              taskType: 'output',
              socketKey: 'input',
              connectionType: 'input',
              socketType: 'anySocket',
            },
          ],
          success: false,
        },
        inputs: {
          trigger: {
            connections: [{ node: 124, output: 'trigger', data: { pins: [] } }],
          },
          input: {
            connections: [{ node: 646, output: 'output', data: { pins: [] } }],
          },
        },
        outputs: {
          trigger: {
            connections: [{ node: 764, input: 'trigger', data: { pins: [] } }],
          },
        },
        position: [-1145.6038660676775, -248.81348929917337],
        name: 'State Write',
      },
      '764': {
        id: 764,
        data: {
          code: '\n// inputs: dictionary of inputs based on socket names\n// data: internal data of the node to read or write to nodes data state\n// state: access to the current game state in the state manager window. Return state to update the state.\nfunction worker(inputs, data, state) {\n\n  // Keys of the object returned must match the names \n  // of your outputs you defined.\n  // To update the state, you must return the modified state.\n  return inputs\n}\n',
          dataControls: {
            name: { expanded: true },
            inputs: { expanded: true },
            outputs: { expanded: true },
            code: { expanded: true },
          },
          inputs: [
            {
              name: 'input',
              taskType: 'output',
              socketKey: 'input',
              connectionType: 'input',
              socketType: 'anySocket',
            },
          ],
          outputs: [
            {
              name: 'input',
              taskType: 'output',
              socketKey: 'input',
              connectionType: 'output',
              socketType: 'anySocket',
            },
          ],
          display: '{"input":"test"}',
          success: false,
        },
        inputs: {
          trigger: {
            connections: [{ node: 763, output: 'trigger', data: { pins: [] } }],
          },
          input: {
            connections: [{ node: 765, output: 'input', data: { pins: [] } }],
          },
        },
        outputs: {
          trigger: {
            connections: [{ node: 233, input: 'trigger', data: { pins: [] } }],
          },
          input: {
            connections: [{ node: 233, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-782.550724272031, -514.965542121559],
        name: 'Code',
      },
      '765': {
        id: 765,
        data: {
          dataControls: { outputs: { expanded: true } },
          outputs: [
            {
              name: 'input',
              taskType: 'output',
              socketKey: 'input',
              connectionType: 'output',
              socketType: 'anySocket',
            },
          ],
          success: false,
        },
        inputs: {},
        outputs: {
          input: {
            connections: [{ node: 764, input: 'input', data: { pins: [] } }],
          },
        },
        position: [-1166.008967431614, -530.4797901925313],
        name: 'State Read',
      },
    },
  },
  createdAt: '2022-05-25T22:31:10.259Z',
  updatedAt: '2022-05-25T22:42:08.703Z',
  deletedAt: null,
  userId: '2508068',
  modules: [],
  gameState: {
    input: 'test',
    introText:
      'This is a simple AI generator app. Type anything and let the AI continue ',
    stateValue: 'value',
  },
} as unknown as Spell
