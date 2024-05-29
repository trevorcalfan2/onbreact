import React from 'react';
import ConfDeclaration from './ConfDeclaration';

function ConfInfo({ formData, setFormData }) {
  return (
    <ConfDeclaration formData={formData} setFormData={setFormData} />
  );
}

export default ConfInfo;
