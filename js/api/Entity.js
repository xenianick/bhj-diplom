/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * Имеет свойство HOST, равно 'https://bhj-diplom.letsdocode.ru'.
 * */
class Entity {

  static URL = '';
  static HOST = 'https://bhj-diplom.letsdocode.ru';
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list( data, callback = f => f ) {
    return createRequest({url: `${this.HOST}${this.URL}`, data: data, responseType: 'json', method: 'GET', callback: (err, response) => callback(err, response)});
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create( data, callback = f => f ) {
    const modifiedData = Object.assign({_method: 'PUT'}, data);
    return createRequest({url: `${this.HOST}${this.URL}`, data: modifiedData, responseType: 'json', method: 'POST', callback: (err, response) => callback(err, response)});
  }

  /**
   * Получает информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static get( id = '', data, callback = f => f ) {
    const modifiedData = Object.assign({id: id}, data);
    return createRequest({url: `${this.HOST}${this.URL}`, data: modifiedData, responseType: 'json', method: 'GET', callback: (err, response) => callback(err, response)});
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove( id = '', data, callback = f => f ) {
    const modifiedData = Object.assign({_method: 'DELETE', id: id}, data);
    return createRequest({url: `${this.HOST}${this.URL}`, data: modifiedData, responseType: 'json', method: 'POST', callback: (err, response) => callback(err, response)});
  }
}