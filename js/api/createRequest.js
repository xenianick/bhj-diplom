/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    if (options.hasOwnProperty('data') && options.method === 'GET') {
      let url = `${options.url}?`;
      for (let key in options.data) {
        url += `${key}=${options.data[key]}&`;
      };
      xhr.open(`${options.method}`, `${url}`);
    } else {
      xhr.open(`${options.method}`, `${options.url}`);
    };
    if (options.hasOwnProperty('headers')) {
      for (let key in options.headers) {
        xhr.setRequestHeader(`${key}`, `${options.headers[key]}`);
      };
    };
    if (options.hasOwnProperty('responseType')) {
      xhr.responseType = `${options.responseType}`;
    };
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.response.success) {
          options.callback(null, xhr.response);
        } else {
          options.callback(null, xhr.response);
        }
      };
    });
    if (options.hasOwnProperty('data') && options.method !== 'GET') {
      const formData = new FormData();
      for (let key in options.data) {
        formData.append(key, options.data[key]);
      }
      xhr.send(formData);
    } else {
      xhr.send();
    };
    return xhr;
};
