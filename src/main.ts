import { createArray3D } from './array-3d'

const strings = [
  '0-1',
  '0-2',
  '0-3',
  '0-4',
  '1-1',
  '1-2',
  '1-3',
  '1-4',
  '2-1',
  '2-2',
  '2-3',
  '2-4',
  '3-1',
  '3-2',
  '3-3',
  '3-4',
]

const objects = [
  { id: 'lorem', date: 'Tue Feb 20 2024 00:01:47 GMT+0300 (GMT+03:00)' },
  { id: 'ipsum', date: 'Tue Feb 20 2024 00:02:19 GMT+0300 (GMT+03:00)' },
  { id: 'dolor', date: 'Tue Feb 20 2024 00:02:27 GMT+0300 (GMT+03:00)' },
  { id: 'sit-amet', date: 'Tue Feb 20 2024 00:02:35 GMT+0300 (GMT+03:00)' },
  { id: 'consectetur', date: 'Tue Feb 20 2024 00:02:47 GMT+0300 (GMT+03:00)' },
  { id: 'adispicing', date: 'Tue Feb 20 2024 00:02:53 GMT+0300 (GMT+03:00)' },
]

const regexps = [
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
  /[^\x00-\x7F]+\ *(?:[^\x00-\x7F]| )*/g,
  /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/gi,
  /#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/g,
  /,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/g,
  /<.*?script.*\/?>/gi,
  /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
  /\/\*[\s\S]*?\*\/|\/\/.*/g,
]

const arrays = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
  [8, 9],
  [10, 11],
]

const instance = createArray3D<string>({
  values: strings,
  // values: Array.from({ length: 24 }, (_, i) => i + 1),
  constraint: 3,
  keepUnsatisfiedRemains: true,
})

const array = instance()

console.log(array)

console.log('--------------------')
