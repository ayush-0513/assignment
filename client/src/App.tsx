// src/App.tsx

import React from 'react';
import { Button, Typography, Space, Card, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import FieldRow from './components/FieldRow';
import JsonPreview from './components/JsonPreview';
import type { SchemaField } from './types';
import './App.css';

const { Title } = Typography;

interface FormData {
  fields: SchemaField[];
}

const App: React.FC = () => {
  const methods = useForm<FormData>({
    defaultValues: {
      fields: [],
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const schemaData = watch('fields');

  const handleAddField = () => {
    append({ id: uuidv4(), name: '', type: 'Field type', children: [] });
  };

  const onSubmit = (data: FormData) => {
    const finalTransformedSchema = transformToSchema(data.fields);
    console.log('Submitted Schema:', finalTransformedSchema);
    alert('Schema submitted! Check console for details.');
  };

  const transformToSchema = (data: SchemaField[]): any => {
    const schema: any = {};
    data.forEach(field => {
      if (field.type === 'nested' && field.children) {
        schema[field.name] = transformToSchema(field.children);
      } else if (field.name) {
        switch (field.type) {
          case 'string':
            schema[field.name] = 'STRING';
            break;
          case 'number':
            schema[field.name] = 'NUMBER';
            break;
          case 'objectid':
            schema[field.name] = 'OBJECTID_VALUE';
            break;
          case 'float':
            schema[field.name] = 0.0;
            break;
          case 'boolean':
            schema[field.name] = false;
            break;
          case 'array':
            schema[field.name] = [];
            break;
          default:
            schema[field.name] = null;
        }
      }
    });
    return schema;
  };

  const finalSchemaForPreview = transformToSchema(schemaData);

  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#1890ff',
      },
    }}>
      <div className="App">
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          JSON Schema Builder
        </Title>

        {/* New flex container for side-by-side layout */}
        <div className="content-container"> 
          <Card className="form-card" style={{ width: '50%' }}> {/* Added a class for potential specific styling */}
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {fields.map((field, index) => (
                    <FieldRow
                      key={field.id}
                      index={index}
                      remove={remove}
                      nestPath={`fields`}
                    />
                  ))}
                </Space>

                <Button
                  type="dashed"
                  onClick={handleAddField}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginTop: 20 }}
                >
                  Add Item
                </Button>

                <Button type="primary" htmlType="submit" size="large" block style={{ marginTop: 30 }}>
                  Submit Schema
                </Button>
              </form>
            </FormProvider>
          </Card>

          <JsonPreview schema={finalSchemaForPreview}  />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;