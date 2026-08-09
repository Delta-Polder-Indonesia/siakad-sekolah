const img = (name: string) => `images/IconPlus/${name}`;

export const THEMES = [
  {
    cls: 'blue',
    label: 'Inovasi',
    main: 'biru/Utama.png',
    layers: [
      ['drone', 'biru/drone.png'],
      ['phone1', 'biru/phone1.png'],
      ['temperature', 'biru/temperature.png'],
      ['remote', 'biru/remote.png'],
      ['smartwatch', 'biru/smartwatch.png'],
      ['actioncam', 'biru/actioncam.png'],
    ],
  },
  {
    cls: 'green',
    label: 'Unggul',
    main: 'hijau/Utama.png',
    layers: [
      ['vase', 'hijau/vase.png'],
      ['tea', 'hijau/tea.png'],
      ['slipper', 'hijau/slipper.png'],
      ['picture', 'hijau/picture.png'],
      ['letter-c', 'hijau/letter-c.png'],
      ['letter-b', 'hijau/letter-b.png'],
      ['letter-a', 'hijau/letter-a.png'],
      ['football', 'hijau/football.png'],
    ],
  },
  {
    cls: 'red',
    label: 'Berdampak',
    main: 'merah/Utama.png',
    layers: [
      ['spoon', 'merah/spoon.png'],
      ['mixer', 'merah/mixer.png'],
      ['eggs', 'merah/eggs.png'],
      ['cherries', 'merah/cherries.png'],
      ['rollover', 'merah/rollover.png'],
      ['shape', 'merah/shape.png'],
      ['pie', 'merah/pie.png'],
    ],
  },
] as const;
