let gitsearch = document.querySelector(".gitsearch");
let output = document.querySelector(".output");
let searchfield = document.querySelector(".gitsearch__formfield");
let chosenTopics = document.querySelector(".chosen-topics");

let searchRequest = "?q=";
let url = new URL( searchRequest,  "https://api.github.com/search/repositories");

searchfield.autocomplete="off";

//FUNCTIONS

const debounce = (fn, debounceTime) => {
    let timer;

    return function() {
        let savedThis = this;
        let savedArgs = arguments;

        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(savedThis, savedArgs), debounceTime);
        
    }

};

const sendLast = debounce(sendRequest, 500);

async function sendRequest(e){
    e.preventDefault();
        let response;
        if (searchfield.value) {
            response = await fetch(url + ( searchfield.value));
        } 
//        else {
//            
//        }
        response = await fetch(url + (searchRequest + searchfield.value));
        let result = await response.json();
        let items = Array.from(result.items);
        showFive(items);
    }
}

function showFive(items) {
    let resultfield = document.querySelector(".output__resultfield");
    resultfield.innerHTML = "";
    
    for (let i = 0; i < 5; i++){
        if (items[i]) {
            let li = document.createElement("li");
            li.classList.add("output__resultfield_result");
            li.textContent = items[i].name;
            li.setAttribute("data-number", `${i}`);
            li.addEventListener("click", (e) => {
                choseThis(e, items);
            });
            resultfield = document.querySelector(".output__resultfield");
            resultfield.append(li);
        }
    }
}

function choseThis(e, items) {
    let numInArr = e.target.dataset.number;
    
    let div = document.createElement("div");
    div.classList.add("chosen-topics-topic");
    
    let span = document.createElement("span");
    span.classList.add("chosen-topics-content");
    span.textContent = `Name: ${items[numInArr].name}`;
    
    let span2 = document.createElement("span");
    span2.classList.add("chosen-topics-content");
    span2.textContent = `Owner: ${items[numInArr].owner.login}`;
    
    let span3 = document.createElement("span");
    span3.classList.add("chosen-topics-content");
    span3.textContent = `Stars: ${items[numInArr].stargazers_count}`;
    
    let closeBut = document.createElement("div");
    closeBut.classList.add("chosen-topics-close");
    closeBut.textContent = "×";
    closeBut.onclick = function () {
        div.remove();
    };
    
    div.append(span);
    div.append(span2);
    div.append(span3);
    div.append(closeBut);
    
    chosenTopics.append(div);
}

//LISTENERS

searchfield.addEventListener("keypress", sendLast);

//DOM
let ul = document.createElement("ul");
ul.classList.add("output__resultfield");
output.append(ul);

//output.textContent = "test";
