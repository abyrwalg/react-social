import { useState, useCallback } from 'react';

import axios from 'axios';

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const request = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setLoading(true);
      try {
        if (body) {
          // eslint-disable-next-line no-param-reassign
          body = JSON.stringify(body);
          // eslint-disable-next-line no-param-reassign
          headers['Content-Type'] = 'application/json';
        }
        // const response = await fetch(url, { method, body, headers });
        // const data = await response.json();
        const response = await axios({ url, method, data: body, headers });
        const { data } = response;

        console.log(response.statusText);

        /* if (response.statusText !== 'OK') {
          throw new Error(data.message || 'Что-то пошло не так');
        } */
        setLoading(false);
        return data;
      } catch (err) {
        setLoading(false);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { loading, request, error, clearError };
};
