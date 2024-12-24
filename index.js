const inputSlider = document.querySelector("[data-lengthSlider]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay= document.querySelector("[data-passwordDisplay]");

const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols = '! @ # $ % ^ & * ( ) _ + - = { } [ ] | \\ : ; " \' < > , . ? / ` ~ ¢ € £ ¥ § ¶ • ÷ × ≠ ± √ ∞ ∫ ≈ ° µ π ∆ Ω ∑ ∂ ≤ ≥ ≡ ∝ ∴ ∵ ∅ ∧ ∨ ∩ ∪ ∈ ∉ ∃ ∀ ∅ ∂ ∇ ⊂ ⊃ ⊆ ⊇ ∈ ∉ ∠ ∇ ‖ ⊥ ∅ ⌂ ◊ ♠ ♣ ♥ ♦ ¢ € £ ¥ § ¶ • ÷ × ≠ ± √ ∞ ∫ ≈ ° µ π ∆ Ω ∑ ∂ ≤ ≥ ≡ ∝ ∴ ∵ ∅ ∧ ∨ ∩ ∪ ∈ ∉ ∃ ∀ ⊂ ⊃ ⊆ ⊇ ∠ ∇ ‖ ⊥ ⌂ ◊';


let password = "";
let passwordLength = 10;
let checkCount=0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc")

// set password Length according to length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerHTML=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"


}
// set indicator function
function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;

}
// get random integer

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;

}
// get random number
function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123))
}
function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,91))
}
function generateSymbol(){
    const randNum = getRandomInteger(0, symbols.length-1);
    return symbols.charAt(randNum);
}

function calcStrenght(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;
    if(lowercaseCheck.checked) hasLower = true;
    if(uppercaseCheck.checked) hasUpper = true;
    if(numberCheck.checked) hasNumber = true;
    if(symbolCheck.checked) hasSymbol = true;
    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >=8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper  ) && (hasNumber || hasSymbol) && passwordLength >=6
    ){
        setIndicator("#0ff0");

    }else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied"
    }
    catch(err){
        copyMsg.innerText="failed to copy";

    }
    // to make copy span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);



}

function shufflePassword(array){
    // fisher yates method
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;


}
function handleCheckboxChange(){
    checkCount=0;
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }

    })
    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

}

allCheckbox.forEach(checkbox=>{
    checkbox.addEventListener("change", handleCheckboxChange)
})

inputSlider.addEventListener("input",   (e)=>{
    passwordLength=e.target.value;
    handleSlider();

});

copyBtn.addEventListener("click", ()=>{
    if(passwordDisplay.value){
        copyContent();
    }

})

generateBtn.addEventListener("click", ()=>{
    // none of the checkbox are selected
    if(checkCount<= 0){
        return;
    }
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the journey to find new password

    password= "";

    // let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password+= generateUppercase();
    // }
    // if(numberCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }

    let funArr = [];
    if(uppercaseCheck.checked){
        funArr.push(generateUppercase)
    }
    if(numberCheck.checked){
        funArr.push(generateRandomNumber)
    }
    if(symbolCheck.checked){
        funArr.push(generateSymbol)
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowercase)
    }
    // compulsory addition

    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();
    }

    // remaining addition

    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex= getRandomInteger(0, funArr.length-1);
        password+=funArr[randIndex]();

    }

    // shuffle the password

    password = shufflePassword(Array.from(password));
    // show password in ui
    passwordDisplay.value=password;
    //calculate strength
    calcStrenght();

})


