export type IdentificationType = {
  id: string;
  title: string;
}

export const IDENTIFICATION_TYPES: Readonly<IdentificationType[]> = [{
  id: 'nif',
  title: 'NIF/NIE',
},{
  id: 'passport',
  title: 'Pasaporte',
}, {

  id: 'dni',
  title: 'DNI',
  }]
