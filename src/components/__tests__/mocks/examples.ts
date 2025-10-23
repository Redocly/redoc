import type { ExampleModelsMap } from '../../Samples';

export const examples: ExampleModelsMap = {
  cat: {
    mime: 'application/json',
    value: {
      category: {
        name: 'string',
        sub: {
          prop1: 'string',
        },
      },
      name: 'Guru',
      photoUrls: ['string'],
      friend: {},
      tags: [
        {
          name: 'string',
        },
      ],
      cvv_check: 'string',
      status: 'available',
      petType: 'cat',
      huntingSkill: 'adventurous',
    },
    rawValue: {},
  },
  dog: {
    mime: 'application/json',
    value: {
      category: {
        name: 'string',
        sub: {
          prop1: 'string',
        },
      },
      name: 'Guru',
      photoUrls: ['string'],
      friend: {},
      tags: [
        {
          name: 'string',
        },
      ],
      cvv_check: 'string',
      status: 'available',
      petType: 'dog',
      packSize: 1,
    },
    rawValue: {},
  },
  bee: {
    mime: 'application/json',
    value: {
      category: {
        name: 'string',
        sub: {
          prop1: 'string',
        },
      },
      name: 'Guru',
      photoUrls: ['string'],
      friend: {},
      tags: [
        {
          name: 'string',
        },
      ],
      cvv_check: 'string',
      status: 'available',
      petType: 'bee',
      honeyPerDay: 3.14,
    },
    rawValue: {},
  },
};

export const examplesJSON: ExampleModelsMap = {
  foo: {
    mime: 'application/json',
    value: {
      foo: 'bar',
    },
    rawValue: {
      foo: 'bar',
    },
    summary: 'A foo example',
  },
  bar: {
    mime: 'application/json',
    value: {
      bar: 'baz',
    },
    rawValue: {
      bar: 'baz',
    },
    summary: 'A bar example',
  },
};

export const exampleXML: ExampleModelsMap = {
  xmlExample: {
    rawValue: undefined,
    value: undefined,
    mime: 'application/xml',
    summary: 'This is an example in XML',
  },
  foo: {
    mime: 'application/xml',
    value: {
      foo: 'bar',
    },
    rawValue: {
      foo: 'bar',
    },
    summary: 'A foo example',
  },
};
