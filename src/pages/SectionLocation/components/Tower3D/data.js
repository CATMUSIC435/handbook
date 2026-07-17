export const floor3MapData = [
  { id: "A-01", x: 1818, y: 1693 },
  { id: "A-02", x: 2186, y: 1697 },
  { id: "A-03", x: 2564, y: 1695 },
  { id: "A-04", x: 2958, y: 1696 },
  { id: "A-05", x: 3421, y: 1635 },
  { id: "A-06", x: 3447, y: 2340 },
  { id: "A-07", x: 3061, y: 2338 },
  { id: "A-08", x: 2675, y: 2341 },
  { id: "A-09", x: 1886, y: 2874 },
  { id: "A-10", x: 1946, y: 3252 },
  { id: "A-11", x: 1303, y: 3320 },
  { id: "A-12", x: 1312, y: 2929 },
  { id: "A-13", x: 1303, y: 2558 },
  { id: "A-14", x: 1312, y: 2171 },
  { id: "A-15", x: 1312, y: 1702 },

  { id: "B-01", x: 6525, y: 1949 },
  { id: "B-02", x: 6525, y: 1564 },
  { id: "B-03", x: 7168, y: 1490 },
  { id: "B-04", x: 7168, y: 1877 },
  { id: "B-05", x: 7168, y: 2257 },
  { id: "B-06", x: 7168, y: 2636 },
  { id: "B-07", x: 7211, y: 3012 },
  { id: "B-08", x: 6525, y: 2961 },
  { id: "B-09", x: 6139, y: 2963 },
  { id: "B-10", x: 5762, y: 2969 },
  { id: "B-11", x: 5376, y: 2969 },
  { id: "B-12", x: 4999, y: 2969 },
  { id: "B-13", x: 4879, y: 2271 },
  { id: "B-14", x: 5265, y: 2314 },
  { id: "B-15", x: 5642, y: 2319 }
];

export const mockFloors = [
  {
    id: 'floor-1',
    name: 'Tầng 3 - 7',
    image: './assets/images/plans/mau-mat-bang-tang-03.png',
    units: [
      { code: 'A-01', type: '1 PN+', builtUpArea: 49.46, carpetArea: 45.48, direction: 'East', view: 'River View', status: 'available', price: '$250,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-02', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'South', view: 'City View', status: 'sold', price: '$350,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-03', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'West', view: 'Internal Park', status: 'booking', price: '$180,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-04', type: '2 PN', builtUpArea: 48.82, carpetArea: 45.54, direction: 'North', view: 'City View', status: 'available', price: '$180,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-05', type: '2 PN', builtUpArea: 66.06, carpetArea: 60.40, direction: 'North East', view: 'City View', status: 'available', price: '$450,000', room3dImage: '/assets/images/room3d/2pn.png' },
      { code: 'A-06', type: '1 PN+', builtUpArea: 49.99, carpetArea: 45.25, direction: 'North West', view: 'City View', status: 'available', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-07', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.16, direction: 'West', view: 'Internal Park', status: 'available', price: '$250,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-08', type: '1 PN+', builtUpArea: 48.90, carpetArea: 45.25, direction: 'South', view: 'City View', status: 'booking', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-09', type: '1 PN', builtUpArea: 43.09, carpetArea: 39.26, direction: 'South West', view: 'City View', status: 'sold', price: '$180,000', room3dImage: '/assets/images/room3d/1pn.png' },
      { code: 'A-10', type: '1 PN+ góc', builtUpArea: 50.48, carpetArea: 45.90, direction: 'West', view: 'Internal Park', status: 'available', price: '$265,000', room3dImage: '/assets/images/room3d/1pn+goc.png' },
      { code: 'A-11', type: '1 PN+ góc', builtUpArea: 49.99, carpetArea: 45.45, direction: 'North West', view: 'City View', status: 'booking', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+goc.png' },
      { code: 'A-12', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'North', view: 'City View', status: 'available', price: '$255,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-13', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'East', view: 'River View', status: 'available', price: '$255,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-14', type: '1 PN+', builtUpArea: 49.24, carpetArea: 45.74, direction: 'South', view: 'City View', status: 'available', price: '$258,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'A-15', type: '2 PN', builtUpArea: 66.31, carpetArea: 60.09, direction: 'South East', view: 'River View', status: 'sold', price: '$460,000', room3dImage: '/assets/images/room3d/2pn.png' },
      { code: 'B-01', type: '1 PN', builtUpArea: 43.09, carpetArea: 39.24, direction: 'South East', view: 'River View', status: 'available', price: '$180,000', room3dImage: '/assets/images/room3d/1pn.png' },
      { code: 'B-02', type: '1 PN', builtUpArea: 50.41, carpetArea: 45.80, direction: 'East', view: 'River View', status: 'available', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+goc.png' },
      { code: 'B-03', type: '1 PN+ góc', builtUpArea: 49.99, carpetArea: 45.45, direction: 'East', view: 'River View', status: 'booking', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+goc.png' },
      { code: 'B-04', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'East', view: 'River View', status: 'available', price: '$255,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-05', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'East', view: 'River View', status: 'available', price: '$255,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-06', type: '1 PN+', builtUpArea: 49.24, carpetArea: 46.03, direction: 'North', view: 'City View', status: 'available', price: '$258,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-07', type: '2 PN loại 2', builtUpArea: 66.31, carpetArea: 60.32, direction: 'North East', view: 'City View', status: 'sold', price: '$460,000', room3dImage: '/assets/images/room3d/2pn-v2.png' },
      { code: 'B-08', type: '1 PN+', builtUpArea: 49.46, carpetArea: 45.48, direction: 'West', view: 'Internal Park', status: 'available', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-09', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'West', view: 'Internal Park', status: 'available', price: '$255,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-10', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'West', view: 'Internal Park', status: 'available', price: '$255,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-11', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'West', view: 'Internal Park', status: 'booking', price: '$255,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-12', type: '1 PN+', builtUpArea: 49.94, carpetArea: 45.37, direction: 'West', view: 'Internal Park', status: 'sold', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-13', type: '2 PN', builtUpArea: 66.32, carpetArea: 60.23, direction: 'South West', view: 'City View', status: 'available', price: '$460,000', room3dImage: '/assets/images/room3d/2pn.png' },
      { code: 'B-14', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.19, direction: 'South West', view: 'City View', status: 'available', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+.png' },
      { code: 'B-15', type: '1 PN+', builtUpArea: 48.91, carpetArea: 45.25, direction: 'South West', view: 'City View', status: 'booking', price: '$260,000', room3dImage: '/assets/images/room3d/1pn+.png' },
    ]
  }
];

export const translateDirection = (dir) => {
  const map = { 'East': 'Đông', 'West': 'Tây', 'South': 'Nam', 'North': 'Bắc', 'South East': 'Đông Nam', 'South West': 'Tây Nam', 'North East': 'Đông Bắc', 'North West': 'Tây Bắc' };
  return map[dir] || dir;
};

export const translateView = (view) => {
  if (view.includes('River View')) return 'View Sông';
  if (view.includes('City View')) return 'View TP';
  if (view.includes('Internal Park')) return 'Nội khu';
  return view;
};
