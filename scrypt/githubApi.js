let gitsearch = document.querySelector(".gitsearch");
let searchField = document.querySelector(".gitsearch__formfield");
let chosenTopics = document.querySelector(".chosen-topics");
let errorField = document.querySelector(".request-error");

let searchRequest = "?q=";
let url = new URL( searchRequest,  "https://api.github.com/search/repositories");

searchField.autocomplete="off";

//FUNCTIONS

const debounce = (fn, debounceTime) => {
    let timer;
    let byzyTime;
    let buzy = false;
    
    return function() {
        let savedThis = this;
        let savedArgs = arguments;
        
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(savedThis, savedArgs);
        }, debounceTime);
        
    };

};

//errorField.textContent = `Error`;
const sendLast = debounce(sendRequest, 300);

async function sendRequest(e){
    e.preventDefault();
    let callTimeDefault = 7000;
        
        let response;
//        let searchFieldValue = searchField.value;
        
        if (searchField.value.trim() !== "") {
            
            response = await fetch(url + ( searchField.value));
            
            if (response.status !== 200) {
                console.log(response);
                errorField.textContent = `Error ${response.status}: ${statusText}, resend in 7 seconss`;
                await setTimeout(() => {
//                    callTimeDefault += 150;
//                    console.log(callTimeDefault);
                    sendRequest(e);
                }, callTimeDefault);
            }
            
            if (response.status === 200) {
               errorField.textContent = ""; 
            }

            let result = await response.json();
            let items = Array.from(result.items);
            showFive(items);
        } else {
            showFive(false);
        }
    }

function showFive(items) {
    
    let resultfield = document.querySelector(".output__resultfield");
    
    if (!items) {
        resultfield.innerHTML = "";
        return false;
    }
    
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
    
//    let topicLink = document.createElement("a");
//    topicLink.href = items[numInArr].html_url;
    
    let topicName = document.createElement("span");
    topicName.classList.add("chosen-topics-content");
    topicName.textContent = `Name: ${items[numInArr].name}`;
    
    let topicOwner = document.createElement("span");
    topicOwner.classList.add("chosen-topics-content");
    topicOwner.textContent = `Owner: ${items[numInArr].owner.login}`;
    
    let topicStars = document.createElement("span");
    topicStars.classList.add("chosen-topics-content");
    topicStars.textContent = `Stars: ${items[numInArr].stargazers_count}`;
    
    let closeBut = document.createElement("div");
    closeBut.classList.add("chosen-topics-close");
    closeBut.textContent = "×";
    closeBut.onclick = function () {
        div.remove();
    };
    
    div.append(topicName);
    div.append(topicOwner);
    div.append(topicStars);
    div.append(closeBut);
    
    let resultfield = document.querySelector(".output__resultfield");
    resultfield.innerHTML = "";
    searchField.value = "";
    
    chosenTopics.append(div);
}

//LISTENERS

    searchField.addEventListener('keydown', function(event) {
        if(event.keyCode === 13) {
           event.preventDefault();
        }
    });
 
searchField.addEventListener("keydown", sendLast);

//DOM
let ul = document.createElement("ul");
ul.classList.add("output__resultfield");
gitsearch.append(ul);

