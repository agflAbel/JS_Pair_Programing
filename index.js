const btn = document.getElementById('add');
btn.addEventListener('click', function (){
    console.log('Click');
});
document.addEventListener('DOMContentLoaded', function(){
    const tittle = document.getElementById('title');
    
});

document.addEventListener('DOMContentLoaded', function () {
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const table = document.getElementById('table');
    const alert = document.getElementById('alert');
    const btn = document.getElementById('add');

    function addTodo(id){
        console.log(id);
    }

    function addTodo(){
        if (title.value === 11 || description.value === '') {
            alert.classList.remove('d-none');
            alert.innerText = 'Title and description are required';
            return;
        }
        alert.classList.add('d-none');
        const row = table.insertRow(); 
        row.setAtr
        row.innerHTML = `
        <td>${title.value}</td>
        <td>${description.value}</td>
        <td class="text-center">
            <input type="checkbox">
        </td>
        <td class="text-right">
            <button class="btn btn-primary mb-1">
                <i class="fa fa-pencil"></i>
            </button>
        </td>
        `;
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('btn','btn-danger','mb-1','ml-1');
        removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
        remoteBtn.onclick= function (e){
            console.log(e.target.parentNode);
        }
        row.children[3].appendChild(removeBtn);
    }
    
    btn.onclick = addTodo;
    
    });
