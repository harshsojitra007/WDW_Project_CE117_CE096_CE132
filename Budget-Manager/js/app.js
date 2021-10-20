class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  submitBudgetForm(){
    const value = this.budgetInput.value;

    // Handles non-positive numbers;
    if(value === '' || value < 0){
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML = `<p>Value must be positive!!</p>`;

      const self = this;
      setTimeout(function(){
        self.budgetFeedback.classList.remove('showItem');
      },3000);
    }else{
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();
    }
  }
  // For Showing Balance;
  showBalance(){
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;

    if(total < 0){
      this.balanceAmount.classList.remove('showGreen','showBlack');
      this.balanceAmount.classList.add('showRed');
    }else if(total > 0){
      this.balanceAmount.classList.remove('showRed','showBlack');
      this.balanceAmount.classList.add('showGreen');
    }

    this.balanceAmount.textContent = total;
  }
  submitExpense(){
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;

    const self = this;

    if(expenseValue === '' || amountValue === '' || amountValue < 0){
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p>Value must be positive</p>`;

      setTimeout(function(){
        self.expenseFeedback.classList.remove('showItem');
      },3000);
    }else{
      let amount = parseInt(amountValue);
      this.expenseInput.value = '';
      this.amountInput.value = '';

      let expense = {
        id:this.itemID,
        title:expenseValue,
        amount:amountValue
      }
      this.itemID++;
      this.itemList.push(expense);

      this.addExpense(expense);
      this.showBalance();
    }
  }
addExpense(expense){
  const div = document.createElement('div');
  div.classList.add('expense');
  div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">

    <h6 class="expense-title mb-0 text-uppercase list-item">${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

    <div class="expense-icons list-item">

    <a href="#" class="edit-icon mx-2" data-id="${expense.id}" onclick="editExpense(${expense})">
      <i class="fas fa-edit"></i>
    </a>
    <a href="#" class="delete-icon" data-id="${expense.id}">
      <i class="fas fa-trash"></i>
    </a>
    </div>
  </div>
 `
 this.expenseList.appendChild(div);
}
  // total Expense;
  totalExpense(){
    let total = 0;
    if(this.itemList.length > 0){
      total += parseInt(this.itemList.reduce(function(account,current){
        account += parseInt(current.amount);
        return parseInt(account);
      },0));
    }
    this.expenseAmount.textContent = parseInt(total);
    return total;
  }
  editExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    this.expenseList.removeChild(parent);

    let expenses = this.itemList.filter(function(item){
      return item.id === id;
    });

    this.expenseInput.value = expenses[0].title;
    this.amountInput.value = expenses[0].amount;

    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }
  deleteExpense(element){}
}
function eventListeners(){
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  // New Instance of UI;
  const ui = new UI();

  // Budget Form Submit;
  budgetForm.addEventListener('submit',function(event){
    event.preventDefault();
    ui.submitBudgetForm();
  });

  // Expense Form Submit;
  expenseForm.addEventListener('submit',function(event){
    event.preventDefault();
    ui.submitExpense();
  });

  // Expense Click;
  expenseList.addEventListener('click',function(event){
    if(event.target.parentElement.classList.contains('edit-icon')){
      ui.editExpense(event.target.parentElement);
    }else if(event.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(event.target.parentElement);
    }
  });
}

document.addEventListener('DOMContentLoaded',function(){
  eventListeners();
});