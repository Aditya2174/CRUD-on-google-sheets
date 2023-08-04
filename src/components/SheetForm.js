// src/components/SheetForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SheetForm = () => {
  const [data, setData] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/sheets');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Data from Google Sheets:</h2>
      <p>{data}</p>
    </div>
  );
};

export default SheetForm;
