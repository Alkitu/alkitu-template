import React from 'react';
import { renderToString } from 'react-dom/server';
import { Calendar } from './src/components/primitives/ui/calendar';

const html = renderToString(<Calendar mode="single" />);
console.log(html);
