/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство HOST, равно значению Entity.HOST.
 * Имеет свойство URL, равное '/user'.
 * */
class User {

  static URL = '/user';
  static HOST = Entity.HOST;
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    const data = JSON.stringify({id: user.id, name: user.name, email: user.email})
    localStorage.setItem('user', `${data}`);
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    if (localStorage.user) {
      return JSON.parse(localStorage.user);
    } else {
      return undefined;
    };
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    delete localStorage.user;
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch( data, callback = f => f ) {
    const request = createRequest({url: `${this.HOST}${this.URL}/current`, data: data, responseType: 'json', method: 'GET', callback: ((err, response) => {
        if (response.success) {
          User.setCurrent(response.user);
        };
        if (response.success === false) {
          User.unsetCurrent();
        };
        callback();
      })
    });
    return request;
  }

   /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback = f => f ) {
    const request = createRequest({url: `${this.HOST}${this.URL}/register`, data: data, responseType: 'json', method: 'POST', callback: (err, response) => {
          if (request.response.success) {
            User.setCurrent(response.user);
          };
          if (request.response.success === false) {
            alert(response.error)
          };
          callback(err, response);
        }
      });
    return request;
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback = f => f ) {
    const request = createRequest({url: `${this.HOST}${this.URL}/login`, data: data, responseType: 'json', method: 'POST', callback: (err, response) => {
        if (response.success) {
          User.setCurrent(response.user);
        };
        if (response.success === false) {
        };
        callback(err, response);
      }
    });
    return request;
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback = f => f ) {
    const request = createRequest({url: `${this.HOST}${this.URL}/logout`, data: data, responseType: 'json', method: 'POST', callback: (err, response) => {
        if (response.success) {
          User.unsetCurrent();
        };
        callback(err, response);
      }
    });
    return request;
  }
}