let from_date = document.getElementById('from_date');
let to_date = document.getElementById('to_date');
from_date.min = new Date().toISOString().split("T")[0];
to_date.min = new Date().toISOString().split("T")[0];


updateToDate = ()=>{
    let selectedDate = new Date(from_date.value);
    console.log(selectedDate);
    selectedDate.setDate(selectedDate.getDate() + 1)
    console.log(selectedDate);
    to_date.min = selectedDate.toISOString().split("T")[0];
}