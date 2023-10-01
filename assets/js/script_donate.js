const options = document.querySelector("#option");
const eventDiv = document.querySelector("#eventDiv");

options.addEventListener('change', ()=>{
    if (options.value==='Food'){
        eventDiv.classList.remove('hidden');
    } else {
        eventDiv.classList.add('hidden');
    }
});