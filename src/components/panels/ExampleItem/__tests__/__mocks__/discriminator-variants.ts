import type { OpenAPIDefinition } from '../../../../../types/openapi.js';

export const discriminatorVariantsDefinition: OpenAPIDefinition = {
  openapi: '3.1.0',
  info: { title: 'Discriminator variants', version: '1.0.0' },
  paths: {},
  components: {
    schemas: {
      PetKind: { type: 'string', enum: ['cat', 'dog'] },
      KindPet: {
        type: 'object',
        required: ['petType'],
        properties: { petType: { type: 'string' } },
        discriminator: {
          propertyName: 'petType',
          mapping: { cat: '#/components/schemas/KindCat', dog: '#/components/schemas/KindDog' },
        },
      },
      KindCat: {
        allOf: [
          { $ref: '#/components/schemas/KindPet' },
          {
            type: 'object',
            properties: {
              petType: { $ref: '#/components/schemas/PetKind' },
              meows: { type: 'boolean' },
            },
          },
        ],
      },
      KindDog: {
        allOf: [
          { $ref: '#/components/schemas/KindPet' },
          {
            type: 'object',
            properties: {
              petType: { $ref: '#/components/schemas/PetKind' },
              barks: { type: 'boolean' },
            },
          },
        ],
      },
      NamedKindPet: {
        oneOf: [
          { $ref: '#/components/schemas/NamedCat' },
          { $ref: '#/components/schemas/NamedDog' },
        ],
        discriminator: { propertyName: 'petType' },
      },
      NamedCat: {
        type: 'object',
        properties: {
          petType: { $ref: '#/components/schemas/PetKind' },
          meows: { type: 'boolean' },
        },
      },
      NamedDog: {
        type: 'object',
        properties: {
          petType: { $ref: '#/components/schemas/PetKind' },
          barks: { type: 'boolean' },
        },
      },
      Circle: {
        title: 'Circle',
        type: 'object',
        required: ['radius'],
        additionalProperties: false,
        properties: { radius: { type: 'number' } },
      },
      Square: {
        title: 'Square',
        type: 'object',
        required: ['side'],
        additionalProperties: false,
        properties: { side: { type: 'integer' } },
      },
      PlainOneOf: {
        oneOf: [{ $ref: '#/components/schemas/Circle' }, { $ref: '#/components/schemas/Square' }],
      },
      PlainAnyOf: {
        anyOf: [{ $ref: '#/components/schemas/Circle' }, { $ref: '#/components/schemas/Square' }],
      },
      Beverage: {
        oneOf: [{ $ref: '#/components/schemas/Coffee' }, { $ref: '#/components/schemas/Tea' }],
        discriminator: {
          propertyName: 'kind',
          mapping: { coffee: '#/components/schemas/Coffee', tea: '#/components/schemas/Tea' },
        },
      },
      Coffee: {
        type: 'object',
        required: ['kind', 'shots'],
        additionalProperties: false,
        properties: { kind: { type: 'string', const: 'espresso' }, shots: { type: 'integer' } },
      },
      Tea: {
        type: 'object',
        required: ['kind', 'leaf'],
        additionalProperties: false,
        properties: { kind: { type: 'string' }, leaf: { type: 'string' } },
      },
      Pet: {
        type: 'object',
        required: ['petType'],
        properties: { petType: { type: 'string' }, name: { type: 'string' } },
        discriminator: { propertyName: 'petType' },
      },
      Cat: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { meows: { type: 'boolean' } } },
        ],
      },
      Dog: {
        allOf: [
          { $ref: '#/components/schemas/Pet' },
          { type: 'object', properties: { barks: { type: 'boolean' } } },
        ],
      },
      Payment: {
        type: 'object',
        required: ['amount'],
        properties: {
          method: { type: 'string', description: 'Payment method' },
          amount: { type: 'number', example: 4.2 },
        },
        oneOf: [{ $ref: '#/components/schemas/Card' }, { $ref: '#/components/schemas/Bank' }],
        discriminator: {
          propertyName: 'method',
          mapping: { card: '#/components/schemas/Card', bank: '#/components/schemas/Bank' },
        },
      },
      Card: {
        type: 'object',
        required: ['method'],
        properties: { method: { const: 'card' }, last4: { type: 'string' } },
      },
      Bank: {
        type: 'object',
        required: ['method'],
        properties: { method: { const: 'bank' }, iban: { type: 'string' } },
      },
      Vehicle: {
        type: 'object',
        required: ['kind'],
        properties: {
          kind: { type: 'string', enum: ['car', 'bike'], description: 'Vehicle kind' },
          wheels: { type: 'integer' },
        },
        discriminator: {
          propertyName: 'kind',
          mapping: { car: '#/components/schemas/Car', bike: '#/components/schemas/Bike' },
        },
      },
      Car: {
        allOf: [
          { $ref: '#/components/schemas/Vehicle' },
          { type: 'object', properties: { doors: { type: 'integer' } } },
        ],
      },
      Bike: {
        allOf: [
          { $ref: '#/components/schemas/Vehicle' },
          { type: 'object', properties: { gears: { type: 'integer' } } },
        ],
      },
      Shipment: {
        type: 'object',
        required: ['mode', 'weight'],
        properties: {
          mode: { type: 'string', enum: ['air', 'sea', 'road'], description: 'Transport mode' },
          weight: { type: 'number', example: 1.5 },
        },
        oneOf: [
          { $ref: '#/components/schemas/AirShipment' },
          { $ref: '#/components/schemas/SeaShipment' },
          { $ref: '#/components/schemas/RoadShipment' },
        ],
        discriminator: {
          propertyName: 'mode',
          mapping: {
            air: '#/components/schemas/AirShipment',
            sea: '#/components/schemas/SeaShipment',
            road: '#/components/schemas/RoadShipment',
          },
        },
      },
      AirShipment: {
        type: 'object',
        properties: { mode: { const: 'air' }, flight: { type: 'string' } },
      },
      SeaShipment: {
        type: 'object',
        properties: { mode: { enum: ['sea'] }, vessel: { type: 'string' } },
      },
      RoadShipment: { type: 'object', properties: { plate: { type: 'string' } } },
      Drink: {
        oneOf: [{ $ref: '#/components/schemas/Brew' }, { $ref: '#/components/schemas/Juice' }],
        discriminator: {
          propertyName: 'kind',
          mapping: { brew: '#/components/schemas/Brew', juice: '#/components/schemas/Juice' },
        },
      },
      Brew: {
        oneOf: [{ $ref: '#/components/schemas/Espresso' }, { $ref: '#/components/schemas/Latte' }],
        discriminator: {
          propertyName: 'style',
          mapping: {
            espresso: '#/components/schemas/Espresso',
            latte: '#/components/schemas/Latte',
          },
        },
      },
      Espresso: {
        type: 'object',
        required: ['kind', 'style'],
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          shots: { type: 'integer' },
          refill: { $ref: '#/components/schemas/Drink' },
        },
      },
      Latte: {
        type: 'object',
        required: ['kind', 'style'],
        properties: {
          kind: { type: 'string' },
          style: { type: 'string' },
          milk: { type: 'string' },
        },
      },
      Juice: {
        type: 'object',
        required: ['kind'],
        properties: { kind: { type: 'string' }, fruit: { type: 'string' } },
      },
      Menu: { type: 'array', items: { $ref: '#/components/schemas/Drink' } },
      Snack: {
        required: ['kind'],
        oneOf: [{ $ref: '#/components/schemas/Chips' }, { $ref: '#/components/schemas/Cookie' }],
        discriminator: {
          propertyName: 'kind',
          mapping: { chips: '#/components/schemas/Chips', cookie: '#/components/schemas/Cookie' },
        },
      },
      Chips: {
        type: 'object',
        properties: { kind: { type: 'string' }, refill: { $ref: '#/components/schemas/Snack' } },
      },
      Cookie: {
        type: 'object',
        properties: { kind: { type: 'string' }, chocolate: { type: 'boolean' } },
      },
      BareDrink: {
        oneOf: [{ $ref: '#/components/schemas/Coffee' }, { $ref: '#/components/schemas/Tea' }],
        discriminator: { propertyName: 'kind', mapping: { coffee: 'Coffee', tea: 'Tea' } },
      },
      PaymentMethod: {
        oneOf: [
          { $ref: '#/components/schemas/CardMethod' },
          { $ref: '#/components/schemas/BankTransfer' },
        ],
        discriminator: { propertyName: 'type' },
      },
      AnyPaymentMethod: {
        anyOf: [
          { $ref: '#/components/schemas/CardMethod' },
          { $ref: '#/components/schemas/BankTransfer' },
        ],
        discriminator: { propertyName: 'type' },
      },
      CardMethod: {
        type: 'object',
        required: ['type', 'last4'],
        additionalProperties: false,
        properties: { type: { type: 'string' }, last4: { type: 'string' } },
      },
      BankTransfer: {
        type: 'object',
        required: ['type', 'iban'],
        additionalProperties: false,
        properties: { type: { type: 'string' }, iban: { type: 'string' } },
      },
      PinnedMethod: {
        oneOf: [
          { $ref: '#/components/schemas/ConstCard' },
          { $ref: '#/components/schemas/RefEnumCard' },
          { $ref: '#/components/schemas/BaseCard' },
        ],
        discriminator: { propertyName: 'type' },
      },
      ConstCard: { type: 'object', required: ['type'], properties: { type: { const: 'card' } } },
      RefEnumCard: {
        type: 'object',
        required: ['type'],
        properties: { type: { $ref: '#/components/schemas/CardRefType' } },
      },
      CardRefType: { type: 'string', enum: ['card-ref'] },
      BaseCard: {
        allOf: [
          { $ref: '#/components/schemas/CardBase' },
          { type: 'object', properties: { last4: { type: 'string' } } },
        ],
      },
      CardBase: {
        type: 'object',
        required: ['type'],
        properties: { type: { const: 'card-base' } },
      },
      RestrictedMethod: {
        type: 'object',
        properties: { type: { type: 'string', enum: ['card', 'bank'] } },
        oneOf: [
          { $ref: '#/components/schemas/CardMethod' },
          { $ref: '#/components/schemas/BankTransfer' },
        ],
        discriminator: { propertyName: 'type' },
      },
      Animal: {
        oneOf: [{ $ref: '#/components/schemas/Canine' }, { $ref: '#/components/schemas/Feline' }],
        discriminator: {
          propertyName: 'type',
          mapping: {
            lab: '#/components/schemas/Canine',
            poodle: '#/components/schemas/Canine',
            cat: '#/components/schemas/Feline',
          },
        },
      },
      Canine: {
        oneOf: [{ $ref: '#/components/schemas/Lab' }, { $ref: '#/components/schemas/Poodle' }],
        discriminator: {
          propertyName: 'type',
          mapping: { lab: '#/components/schemas/Lab', poodle: '#/components/schemas/Poodle' },
        },
      },
      Lab: {
        type: 'object',
        required: ['type', 'retrieves'],
        additionalProperties: false,
        properties: { type: { type: 'string' }, retrieves: { type: 'boolean' } },
      },
      Poodle: {
        type: 'object',
        required: ['type', 'curls'],
        additionalProperties: false,
        properties: { type: { type: 'string' }, curls: { type: 'integer' } },
      },
      Feline: {
        type: 'object',
        required: ['type', 'indoor'],
        additionalProperties: false,
        properties: { type: { type: 'string' }, indoor: { type: 'boolean' } },
      },
      ZooAnimal: {
        oneOf: [{ $ref: '#/components/schemas/Canine' }, { $ref: '#/components/schemas/Feline' }],
        discriminator: {
          propertyName: 'type',
          mapping: { dog: '#/components/schemas/Canine', cat: '#/components/schemas/Feline' },
        },
      },
      Creature: {
        oneOf: [
          { $ref: '#/components/schemas/DogBreed' },
          { $ref: '#/components/schemas/CatBreed' },
        ],
        discriminator: {
          propertyName: 'species',
          mapping: { dog: '#/components/schemas/DogBreed', cat: '#/components/schemas/CatBreed' },
        },
      },
      DogBreed: {
        oneOf: [
          { $ref: '#/components/schemas/BreedLab' },
          { $ref: '#/components/schemas/BreedPoodle' },
        ],
        discriminator: {
          propertyName: 'breed',
          mapping: {
            lab: '#/components/schemas/BreedLab',
            poodle: '#/components/schemas/BreedPoodle',
          },
        },
      },
      BreedLab: {
        type: 'object',
        required: ['species', 'breed', 'retrieves'],
        properties: {
          species: { type: 'string' },
          breed: { type: 'string' },
          retrieves: { type: 'boolean' },
        },
      },
      BreedPoodle: {
        type: 'object',
        required: ['species', 'breed', 'curls'],
        properties: {
          species: { type: 'string' },
          breed: { type: 'string' },
          curls: { type: 'integer' },
        },
      },
      CatBreed: {
        type: 'object',
        required: ['species', 'indoor'],
        properties: { species: { type: 'string' }, indoor: { type: 'boolean' } },
      },
      Pack: {
        oneOf: [{ $ref: '#/components/schemas/PackDog' }, { $ref: '#/components/schemas/PackCat' }],
        discriminator: { propertyName: 'type' },
      },
      PackDog: {
        oneOf: [
          { $ref: '#/components/schemas/PackLab' },
          { $ref: '#/components/schemas/PackPoodle' },
        ],
        discriminator: { propertyName: 'type' },
      },
      PackLab: {
        type: 'object',
        required: ['type', 'retrieves'],
        properties: { type: { const: 'lab' }, retrieves: { type: 'boolean' } },
      },
      PackPoodle: {
        type: 'object',
        required: ['type', 'curls'],
        properties: { type: { const: 'poodle' }, curls: { type: 'integer' } },
      },
      PackCat: {
        type: 'object',
        required: ['type'],
        properties: { type: { const: 'cat' }, indoor: { type: 'boolean' } },
      },
      HouseCat: {
        allOf: [
          { $ref: '#/components/schemas/Cat' },
          { type: 'object', properties: { indoor: { type: 'boolean' } } },
        ],
      },
      MaybeDog: {
        description: 'A dog, or nothing',
        nullable: true,
        allOf: [{ $ref: '#/components/schemas/Dog' }],
      },
      DrinkSettings: {
        type: 'object',
        properties: {
          default: {
            oneOf: [{ $ref: '#/components/schemas/Coffee' }, { $ref: '#/components/schemas/Tea' }],
            discriminator: { propertyName: 'kind', mapping: { coffee: 'Coffee', tea: 'Tea' } },
          },
        },
      },
      ExampleHostMethod: {
        type: 'object',
        properties: { type: { type: 'string', example: 'CardMethod' } },
        oneOf: [
          { $ref: '#/components/schemas/CardMethod' },
          { $ref: '#/components/schemas/BankTransfer' },
        ],
        discriminator: { propertyName: 'type' },
      },
      Kennel: {
        oneOf: [{ $ref: '#/components/schemas/Herding' }, { $ref: '#/components/schemas/Toy' }],
        discriminator: {
          propertyName: 'group',
          mapping: { herding: '#/components/schemas/Herding', toy: '#/components/schemas/Toy' },
        },
      },
      Herding: {
        oneOf: [{ $ref: '#/components/schemas/Shepherd' }, { $ref: '#/components/schemas/Collie' }],
        discriminator: {
          propertyName: 'breed',
          mapping: {
            shepherd: '#/components/schemas/Shepherd',
            collie: '#/components/schemas/Collie',
          },
        },
      },
      Shepherd: {
        allOf: [
          { $ref: '#/components/schemas/Kennel' },
          {
            type: 'object',
            properties: {
              group: { type: 'string' },
              breed: { type: 'string' },
              herds: { type: 'boolean' },
            },
          },
        ],
      },
      Collie: {
        type: 'object',
        properties: {
          group: { type: 'string' },
          breed: { type: 'string' },
          smart: { type: 'boolean' },
        },
      },
      Toy: { type: 'object', properties: { group: { type: 'string' }, tiny: { type: 'boolean' } } },
      TeaOrder: {
        allOf: [
          { $ref: '#/components/schemas/Beverage' },
          { $ref: '#/components/schemas/Tea' },
          { type: 'object', properties: { note: { type: 'string' } } },
        ],
      },
      Layout: {
        type: 'object',
        oneOf: [
          { $ref: '#/components/schemas/LayoutRow' },
          { $ref: '#/components/schemas/LayoutDot' },
        ],
        discriminator: {
          propertyName: 'kind',
          mapping: { row: '#/components/schemas/LayoutRow', dot: '#/components/schemas/LayoutDot' },
        },
      },
      LayoutRow: {
        type: 'object',
        properties: {
          kind: { type: 'string' },
          items: { type: 'array', items: { $ref: '#/components/schemas/Layout' } },
        },
      },
      LayoutDot: {
        type: 'object',
        properties: { kind: { type: 'string' }, r: { type: 'number' } },
      },
      InheritedExampleMethod: {
        type: 'object',
        properties: { type: { type: 'string', example: 'card' } },
        oneOf: [
          { $ref: '#/components/schemas/InheritCard' },
          { $ref: '#/components/schemas/InheritBank' },
        ],
        discriminator: { propertyName: 'type' },
      },
      InheritCard: {
        allOf: [
          { $ref: '#/components/schemas/InheritedExampleMethod' },
          { type: 'object', properties: { last4: { type: 'string' } } },
        ],
      },
      InheritBank: {
        allOf: [
          { $ref: '#/components/schemas/InheritedExampleMethod' },
          { type: 'object', properties: { iban: { type: 'string' } } },
        ],
      },
      MethodBase: {
        type: 'object',
        properties: { type: { type: 'string', enum: ['card', 'bank'] } },
      },
      PointerMethod: {
        type: 'object',
        properties: { type: { $ref: '#/components/schemas/MethodBase/properties/type' } },
        oneOf: [
          { $ref: '#/components/schemas/CardMethod' },
          { $ref: '#/components/schemas/BankTransfer' },
        ],
        discriminator: { propertyName: 'type' },
      },
      ConstChoiceMethod: {
        type: 'object',
        properties: { type: { oneOf: [{ const: 'card' }, { const: 'bank' }] } },
        oneOf: [
          { $ref: '#/components/schemas/CardMethod' },
          { $ref: '#/components/schemas/BankTransfer' },
        ],
        discriminator: { propertyName: 'type' },
      },
      OuterRestrictedMethod: {
        type: 'object',
        properties: { type: { type: 'string', enum: ['card', 'bank'] } },
        allOf: [
          {
            oneOf: [
              { $ref: '#/components/schemas/CardMethod' },
              { $ref: '#/components/schemas/BankTransfer' },
            ],
            discriminator: { propertyName: 'type' },
          },
        ],
      },
    },
  },
};
