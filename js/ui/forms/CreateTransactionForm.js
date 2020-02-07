/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    if (User.current()) {
      const authUser = User.current();
      Account.list(authUser, (err, response) => {
        if (err) {
          console.log(err);
        };
        if (!err && response.success) {
          const expenseAccountsList = document.getElementById('expense-accounts-list');
          const incomeAccountsList = document.getElementById('income-accounts-list');
          expenseAccountsList.innerHTML = '';
          incomeAccountsList.innerHTML = '';
          response.data.forEach(item => {
            const listItemHtml = `<option value="${item.id}">${item.name}</option>`;
            expenseAccountsList.innerHTML += listItemHtml;
            incomeAccountsList.innerHTML += listItemHtml;
          });
        };
      });
    };
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( options ) {
    if (options.type === 'income') {
      Transaction.create(options, (err, response) => {
        if (err) {
          console.log(err);
        };
        if (!err && response.success) {
          App.getModal('newIncome').close();
          document.getElementById('new-income-form').reset();
          App.update();
        };
      });
    };
    if (options.type === 'expense') {
      Transaction.create(options, (err, response) => {
        if (err) {
          console.log(err);
        };
        if (!err && response.success) {
          App.getModal('newExpense').close();
          document.getElementById('new-expense-form').reset();
          App.update();
        };
      });
    };
  }
}  