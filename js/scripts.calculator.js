

/* Scripts para saber si tiene menos de un año */

const calculatorForm = document.getElementById('js-calculator__form')


const radioDays = document.getElementById('js-less-than-a-year-radio')
const radioYears = document.getElementById('js-more-than-a-year-radio')
const inputYears = document.getElementById('js-calculator__input-years')
const inputDays = document.getElementById('js-calculator__input-days')

radioYears.onclick = function (){
    inputYears.style.display = 'flex'
    inputYears.children['years'].required = true
    inputDays.children['days'].required = false
    calculatorForm.elements['days'].value = ''
    closeResults()
}

radioDays.onclick = function (){
    inputYears.style.display = 'none'
    inputYears.children['years'].required = false
    inputDays.style.display = 'flex'
    inputDays.children['days'].required = true
    calculatorForm.elements['years'].value = ''
    closeResults()
}

/* Script calculo de salario y bono */
const calculatorSubmit = document.getElementById('js-calculator__submit')
const results = document.getElementById('js-results')
const resultsForm = document.getElementById('js-results__form')

function calculateSalaryPerDay (){
    return calculatorForm.elements['salary'].value / 30
}

function calculateSalaryPerYear(){
    return calculatorForm.elements['salary'].value * 12
}



function calculateTotalIncome () {
    let salaryPerDay = calculateSalaryPerDay ()
    let totalDays = (calculatorForm.elements['years'].value * 365) + parseInt(calculatorForm.elements['days'].value)
    return  salaryPerDay * totalDays
}

function calculateBonus(){
    let salaryPerDay = calculateSalaryPerDay()

    if (radioDays.checked){
        return (calculatorForm.elements['days'].value * calculatorForm.elements['salary'].value/2)/365
        
    } else if (calculatorForm.elements['years'].value >= 1  &&  calculatorForm.elements['years'].value < 3){
        return salaryPerDay * 15

    } else if (calculatorForm.elements['years'].value >= 3  &&  calculatorForm.elements['years'].value < 10) {
        return salaryPerDay * 19

    } else {
        return salaryPerDay * 21
    }
}

calculatorForm.onsubmit = function (event){
    event.preventDefault()
    showResults()
    resultsForm.elements['salary-per-day'].value = calculateSalaryPerDay().toFixed(2)
    resultsForm.elements['salary-per-year'].value = calculateSalaryPerYear().toFixed(2)
    resultsForm.elements['total-income'].value = calculateTotalIncome().toFixed(2)
    resultsForm.elements['bonus'].value = calculateBonus().toFixed(2)
    calculatorSubmit.disabled= true
    calculatorSubmit.classList.remove('calculator__submit-active')
    calculatorSubmit.classList.add('calculator__submit-disabled')
    setTimeout(()=>{
        calculatorSubmit.disabled = false;
        calculatorSubmit.classList.remove('calculator__submit-disabled')
        calculatorSubmit.classList.add('calculator__submit-active')
        }
        ,3500)
}
    

/* Scripts for showing results */



function showResults (){
    results.style.marginTop = '-1.5em'
}

function closeResults (){
    results.style.marginTop = '-13.5em'
}