/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const elemBody = document.querySelector('body');
    const burger = document.querySelector('.sidebar-toggle');
    burger.addEventListener('click', (e) => {
      elemBody.classList.toggle('sidebar-open');
      elemBody.classList.toggle('sidebar-collapse');
      e.preventDefault();
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginBtn = document.querySelector('.menu-item_login > a');
    loginBtn.addEventListener('click', (e) => {
      App.getModal('login').open()
      e.preventDefault();
    });
    const registerBtn = document.querySelector('.menu-item_register > a');
    registerBtn.addEventListener('click', (e) => {
      App.getModal('register').open()
      e.preventDefault();
    });
    const logoutBtn = document.querySelector('.menu-item_logout > a');
    logoutBtn.addEventListener('click', (e) => {
      User.logout(User.current(), (response) => {
        if (response.success === true) {
          App.setState('init');
        };
      });
      e.preventDefault();
    });
  }

}