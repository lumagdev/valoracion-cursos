import React from 'react';
import axios from 'axios';

export const getTopAuthors = async () => 
{
    const headers = {
        'Content-Type': 'application/json',
    }

    const response = await axios.get('http://127.0.0.1:8000/api/authors/top-authors', {headers});

    return response.data;
}