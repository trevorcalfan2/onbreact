import React, { forwardRef } from 'react';
import ConfDeclaration from './ConfDeclaration';

const ConfInfo = forwardRef(({ formData, setFormData }, ref) => (
  <ConfDeclaration formData={formData} setFormData={setFormData} innerRef={ref} />
));

export default ConfInfo;
