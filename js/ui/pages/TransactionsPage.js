/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    this.element = element;
    if (!this.element) {
      alert('Ошибочка!');
    };
  }

  content = document.querySelector('.content');
  title = document.querySelector('.content-title');

  listen(e) {
    this.page.removeAccount();
  };
  
  onRemove = {handleEvent: this.listen, page: this};

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountBtn = document.querySelector('.remove-account');
    removeAccountBtn.removeEventListener('click', this.onRemove);
    if (this.title.innerText !== 'Название счёта') {
      removeAccountBtn.addEventListener('click', this.onRemove);
    };
    const removeTransactionBtns = Array.from(document.querySelectorAll('.transaction__remove'));
    removeTransactionBtns.forEach(item => item.addEventListener('click', () => {
      const transactionId = item.getAttribute('data-id');
      this.removeTransaction(transactionId);
    }));
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return
    };
    const user = User.current();
    Account.get(options.account_id, user, (err, response) => {
      if (err) {
        console.log(err);
      };
      if (!err && response.success) {
        const title = response.data.filter(item => item.id === options.account_id);
        if (title.length !== 0) {
          this.renderTitle(title[0].name);
        };
      };
      Transaction.list(options, (err, response) => {
        if (err) {
          console.log(err);
        };
        if (!err && response.success) {
          this.renderTransactions(response.data);
          this.registerEvents();
        };
      });
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    const user = User.current();
    if (confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove(App.lastOption.account_id, {email: user.email}, (err, response) => {
        if (err) {
          console.log(err);
        };
        if (!err && response.success) {
          this.clear();
          App.update();
        };
      });
    };
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
    const user = User.current()
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, {email: user.email}, (err, response) => {
        if (err) {
          console.log(err);
        };
        if (!err && response.success) {
          App.update();
        };
      });
    };
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(App.lastOption);
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.content.innerHTML = '';
    this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle( name ) {
    this.title.innerText = `${name}`;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
    const year = date.substring(0, 4);
    let month = parseInt(date.substring(5, 7));
    const day = date.substring(8, 10);
    const hoursAndMinutes = date.substring(11, 16);
    const monthesRus = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    monthesRus.forEach((item, i) => {
      if (i === (month - 1)) {
        month = monthesRus[i].toString();
      }
    });
    return `${day} ${month} ${year} г. в ${hoursAndMinutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML( item ) {
    const date = this.formatDate(item.created_at)
    const transactionHTML = 
      `<div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${date}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
              ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>`;
    return transactionHTML;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions( data ) {
    this.content.innerHTML = '';
    data.forEach(item => this.content.innerHTML += this.getTransactionHTML(item));
  }
}