/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
    if (!this.element) {
      alert('Ошибочка!');
    };
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountBtn = document.querySelector('.create-account');
    const accounts = Array.from(document.querySelectorAll('.account'));
    createAccountBtn.addEventListener('click', () => {
      App.getModal('createAccount').open();
    });
    accounts.forEach(item => item.addEventListener('click', () => {
      this.onSelectAccount(item);
    }));
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      const authUser = User.current();
      Account.list(authUser, (err, response) => {
        if (err) {
          console.log(err);
        };
        if (!err && response.success) {
          this.clear();
          response.data.forEach(item => this.renderItem(item));
          this.registerEvents(); 
        };
      });
    };
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = Array.from(document.querySelectorAll('.account'));
    accounts.forEach(item => item.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const accounts = Array.from(document.querySelectorAll('.account'));
    const prevActivElem = accounts.filter(item => item.classList.contains('active'));
    if (prevActivElem.length === 0) {
      element.classList.add('active');
    } else {
      prevActivElem[0].classList.remove('active');
      element.classList.add('active');
    };
    const accountId = element.getAttribute('data-id');
    App.showPage('transactions', {account_id: accountId});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML( item ) {
    const accountHtml = 
    `<li class="account" data-id="${item.id}">
      <a href="#">
        <span>${item.name}</span> /
        <span>${item.sum} ₽</span>
      </a>
    </li>`;
    return accountHtml;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem( item ) {
    const accountHtml = this.getAccountHTML(item);
    const accountsContainer = this.element;
    accountsContainer.innerHTML += accountHtml;
  }
}