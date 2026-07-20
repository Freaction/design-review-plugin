export const SCAN_NODE_TYPES: NodeType[] = [
  'FRAME',
  'GROUP',
  'COMPONENT',
  'COMPONENT_SET',
  'INSTANCE',
  'RECTANGLE',
  'ELLIPSE',
  'POLYGON',
  'STAR',
  'VECTOR',
  'LINE',
  'BOOLEAN_OPERATION',
  'TEXT',
  'SECTION',
];

export const FIGJAM_SKIP_TYPES = new Set<string>([
  'STICKY',
  'SHAPE_WITH_TEXT',
  'CONNECTOR',
  'STAMP',
  'WIDGET',
  'HIGHLIGHT',
]);
