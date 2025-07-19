import React from 'react';
import { Card } from 'antd';

interface JsonPreviewProps {
  schema: any;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ schema }) => {
  return (
    <Card title="JSON Schema Preview" style={{ marginTop: 20 , width: '50%' }}>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(schema, null, 2)}
      </pre>
    </Card>
  );
};

export default JsonPreview;