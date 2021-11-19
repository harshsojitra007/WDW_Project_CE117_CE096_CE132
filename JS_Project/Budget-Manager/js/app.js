let inputBudget = 0;
let changeBudget = false;

let inputExpense = 0;
let changeExpense = false;

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

    inputBudget = this.budgetInput;
  }
  submitBudgetForm(){
    const value = this.budgetInput.value;
    inputBudget = value;

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
    this.balanceAmount.textContent = total;
    
    if(total < 0){
      this.balanceAmount.classList.remove('showGreen','showBlack');
      this.balanceAmount.classList.add('showRed');
    }
    else if(total > 0){
      this.balanceAmount.classList.remove('showRed','showBlack');
      this.balanceAmount.classList.add('showGreen');
    }
    updateChartBudget(total);
  }
  submitExpense(){
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;

    if(expenseValue === '' || amountValue === '' || amountValue < 0){
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p>Value must be positive</p>`;

      const self = this;
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
        amount:amount
      }
      this.itemID++;
      this.itemList.push(expense);

      this.addExpense(expense);
      this.showBalance();
      updateChartExpense(amount);
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

    <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
      <i class="fas fa-edit"></i>
    </a>
    <a href="#" class="delete-icon" data-id="${expense.id}">
      <i class="fas fa-trash"></i>
    </a>
    </div>
  </div>
 `;
 this.expenseList.appendChild(div);
}
  // total Expense;
  totalExpense(){
    let total = 0;
    if(this.itemList.length > 0){
      total = this.itemList.reduce(function(acc,curr){
        acc += curr.amount;
        return acc;
      },0);
    }
    this.expenseAmount.textContent = total;
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
  deleteExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    this.expenseList.removeChild(parent);

    let tempList = this.itemList.filter(function(item){
      return item.id !== id;
    });

    this.itemList = tempList;
    this.showBalance();
  }
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

// Creating Chart
const ctx = document.getElementById('myChart');

const data = {
  labels: [2016, 2017, 2018, 2019, 2020, 2021],
  datasets: [{
    label: 'Expenses',
    // some data for demo purpose;
    data: [2300, 1800, 2250, 1800, 2500],
    // Red for Expenses;
    backgroundColor: [
      'rgba(255, 99, 132)'
    ],
    borderColor: [
      'rgba(255, 99, 132)'
    ],
    borderWidth: 1
  },
  {
    label: 'Balance',
    // some data for demo purpose;
    data: [2500, 2000, 2400, 1900, 2600],
    // Green for Balance;
    backgroundColor: [
      '#136207'
    ],
    borderColor: [
      '#136207'
    ],
    borderWidth: 1
  }]
}

const config = {
  type: 'line',
  data,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
}

let chart = new Chart(ctx,config);

function updateChartBudget(input){
  chart.config.data.datasets[1].data.push(input);
  chart.config.data.datasets[1].data.shift();
  chart.update();
}
function updateChartExpense(input){
  chart.config.data.datasets[0].data.push(input);
  chart.config.data.datasets[0].data.shift();
  chart.update();
}