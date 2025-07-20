import React from 'react';
import { Input, Select, Button, Switch, Space } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';

interface FieldRowProps {
  index: number;
  remove: (index: number) => void;
  nestPath: string; // Path for react-hook-form's nested fields
}

const FieldRow: React.FC<FieldRowProps> = ({ index, remove, nestPath }) => {
  const { control, watch } = useFormContext();
  const fieldType = watch(`${nestPath}.${index}.type`);

  // For managing nested children fields
  const { fields, append, remove: removeNested } = useFieldArray({
    control,
    name: `${nestPath}.${index}.children` as 'fields',
  });

  const handleAddNestedField = () => {
    append({ id: String(Date.now()), name: '', type: 'string' });
  };

  return (
    <div style={{ border: '1px solid #d9d9d9', padding: 10, marginBottom: 10, borderRadius: 2 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 10 }}>
        {/* Field Name Input */}
        <Controller
          name={`${nestPath}.${index}.name`}
          control={control}
          rules={{ required: 'Field name is required' }} 
          render={({ field, fieldState: { error } }) => (
            <Input
              placeholder="Field name"
              {...field}
              status={error ? 'error' : ''} 
              style={{ width: 150 }}
            />
          )}
        />

        {/* Field Type Selector */}
        <Controller
          name={`${nestPath}.${index}.type`}
          control={control}
          render={({ field }) => (
            <Select
              placeholder="Field type"
              {...field}
              style={{ width: 120 }}
              options={[
                // { value: 'field Type', label: 'field Type' },
                { value: 'string', label: 'String' },
                { value: 'number', label: 'Number' },
                { value: 'nested', label: 'Nested' },
                { value: 'objectid', label: 'Object ID' },
                { value: 'float', label: 'Float' },
                { value: 'boolean', label: 'Boolean' },
                { value: 'array', label: 'Array' },
              ]}
            />
          )}
        />

       
        <Switch checkedChildren="Required" unCheckedChildren="Optional" defaultChecked={true} />

        
        <Button
          type="text"
          danger // Ant Design danger style for destructive actions
          icon={<CloseOutlined />}
          onClick={() => remove(index)}
        />
      </Space>

      {fieldType === 'nested' && (
        <div style={{ marginLeft: 20, borderLeft: '2px solid #eee', paddingLeft: 10 }}>
          <h4>Nested Fields:</h4>
          {fields.map((field, nestedIdx) => (
            <FieldRow
              key={field.id}
              index={nestedIdx}
              remove={removeNested}
              nestPath={`${nestPath}.${index}.children`} 
            />
          ))}
          {/* Button to add more nested fields */}
          <Button
            type="dashed"
            onClick={handleAddNestedField}
            block // Makes the button take full width
            icon={<PlusOutlined />}
            style={{ marginTop: 10 }}
          >
            Add Nested Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default FieldRow;