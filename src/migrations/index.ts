import * as migration_20260228_053621 from './20260228_053621';
import * as migration_20260228_054339 from './20260228_054339';
import * as migration_20260228_055451 from './20260228_055451';

export const migrations = [
  {
    up: migration_20260228_053621.up,
    down: migration_20260228_053621.down,
    name: '20260228_053621',
  },
  {
    up: migration_20260228_054339.up,
    down: migration_20260228_054339.down,
    name: '20260228_054339',
  },
  {
    up: migration_20260228_055451.up,
    down: migration_20260228_055451.down,
    name: '20260228_055451'
  },
];
