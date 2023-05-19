const conditionsForm = document.forms.conditions;
const resultContainer = document.querySelector('.result');

conditionsForm.addEventListener('submit', (Event) => {

    Event.preventDefault();

    resultContainer.textContent = '';

    let creditSum = conditionsForm.sum.value;
    let months = conditionsForm.months.value;
    let percentage = conditionsForm.percent.value;
    let dateStart = conditionsForm.date.value

    let monthlyPayment = countMonthlyPayment(creditSum, months, percentage);
   
    let numberOfMonth = dateFormat(dateStart)-1;
    let theYear = yearFormat(dateStart);
    let monthlyPaymentPercent = creditSum*(percentage/100)*30/365;

    let schedule = [{}];
    let allPercents = [];
    let allDebts = [];

        for(let i = 0; i < months; i++) {

            numberOfMonth = numberOfMonth+1;
            
            if(numberOfMonth == 1 || numberOfMonth == 3 || numberOfMonth == 5 || numberOfMonth == 7 || numberOfMonth == 8 || numberOfMonth == 10 || numberOfMonth == 12) {
                monthlyPaymentPercent = creditSum*(percentage/100)*31/365;

            } else if (numberOfMonth == 2) {
                monthlyPaymentPercent = creditSum*(percentage/100)*28/365;

            }  else if(numberOfMonth == 4 || numberOfMonth == 6 || numberOfMonth == 9 || numberOfMonth == 11) {
                monthlyPaymentPercent = creditSum*(percentage/100)*30/365;

            } else if(numberOfMonth == 13) {
                monthlyPaymentPercent = creditSum*(percentage/100)*31/365;
            }

            creditSum = creditSum-(monthlyPayment-monthlyPaymentPercent);

            if(numberOfMonth == 13) {
                numberOfMonth = 1;
                theYear = theYear+1;
            } else {
                numberOfMonth = numberOfMonth;
            }

           

            createElements(monthlyPayment, i, creditSum, monthlyPaymentPercent, dateFormatToText(numberOfMonth), theYear);
            schedule.push({
                number: i+1,
                payment: monthlyPayment,
                percents: monthlyPaymentPercent,
                debtLeft: creditSum
            });

            allPercents.push(monthlyPaymentPercent);
            allDebts.push(monthlyPayment-monthlyPaymentPercent);

            if(i == months-1) {
                makeFinalLine(schedule, allPercents, allDebts);
            }
        }
    

});

//Функция считает размер ежемесячного платежа
function countMonthlyPayment(sum, months, percentage) {
    let argPerc = percentage/12/100;
    let res = sum*(argPerc*(1+argPerc)**months)/((1+argPerc)**months-1);

    return res;
};

function createElements(monthlyPayment, num, sum, monthlyPaymentPercent, month, year) {

    let formattedPayment = formatRes(monthlyPayment);
    let monthlyPaymentPercentFormatted = formatRes(monthlyPaymentPercent);

    let resuElement = document.createElement('div');
    let paymentNumber = document.createElement('div');
    let paymentDate = document.createElement('div');
    let paymentSum = document.createElement('div');
    let percentsSum = document.createElement('div');
    let debt = document.createElement('div');
    let debtLeft = document.createElement('div');

    resuElement.classList.add('result__line');
    paymentNumber.classList.add('element');
    paymentDate.classList.add('element');
    paymentSum.classList.add('element');
    percentsSum.classList.add('element');
    debt.classList.add('element');
    debtLeft.classList.add('element');

    resultContainer.appendChild(resuElement);
    resuElement.appendChild(paymentNumber);
    resuElement.appendChild(paymentDate);
    resuElement.appendChild(paymentSum);
    resuElement.appendChild(percentsSum);
    resuElement.appendChild(debt);
    resuElement.appendChild(debtLeft);

    paymentNumber.textContent = num+1;
    paymentDate.textContent = month + ', ' + year;
    paymentSum.textContent = formattedPayment;
    percentsSum.textContent = monthlyPaymentPercentFormatted;
    debt.textContent = formatRes(monthlyPayment-monthlyPaymentPercent);
    debtLeft.textContent = formatRes(sum);
}

//Функция преобразования чисел на разряды - проблемы между тысячами
function formatRes(res) {
    let resultat = (parseFloat(res).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return resultat;
}

//Функция выдергивает номер месяца из даты, введенной пользователем
function dateFormat(date) {
    let dateFormat = parseInt(date.split('').slice(5,7).join(''));
    return dateFormat;
}

//Функция выдергивает год из даты, введенной пользователем
function yearFormat(date) {
    let dateFormat = parseInt(date.split('').slice(0,4).join(''));
    return dateFormat;
}

//Функция преобразовывает числовой месяц в название
function dateFormatToText(numberOfMonth) {
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    return(monthNames[numberOfMonth-1]);
}

//Расчет финальной строки в графике
function makeFinalLine(schedule, allPercents, allDebts) {

    let percentsSum = allPercents.reduce((partialSum, a) => partialSum + a, 0);
    let debtSum = allDebts.reduce((partialSum, a) => partialSum + a, 0);

    let resultLine = document.createElement('div');
    let paymentsCount = document.createElement('div');
    let dateOfLastPayment = document.createElement('div');
    let paymentsSum = document.createElement('div');
    let percentSum = document.createElement('div');
    let debtsSum = document.createElement('div');
    
    resultLine.classList.add('result__line');
    resultLine.classList.add('final');
    paymentsCount.classList.add('element');
    dateOfLastPayment.classList.add('element');
    paymentsSum.classList.add('element');
    percentSum.classList.add('element');
    debtsSum.classList.add('element');

    resultContainer.appendChild(resultLine);
    resultLine.appendChild(paymentsCount);
    resultLine.appendChild(dateOfLastPayment);
    resultLine.appendChild(paymentsSum);
    resultLine.appendChild(percentSum);
    resultLine.appendChild(debtsSum);

    paymentsCount.textContent = '';
    dateOfLastPayment.textContent = '';
    paymentsSum.textContent = formatRes(schedule[1].payment*(schedule.length-1));
    percentSum.textContent = formatRes(percentsSum);
    debtsSum.textContent = formatRes(debtSum);

    console.log(schedule)
}