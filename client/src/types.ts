export type FieldType = 'string' | 'number' | 'nested' | 'objectid' | 'float' | 'boolean' | 'array' | 'Field type';

export interface SchemaField {
  id: string; // Unique ID for React keys and easy manipulation
  name: string;
  type: FieldType;
  children?: SchemaField[]; 
  
}