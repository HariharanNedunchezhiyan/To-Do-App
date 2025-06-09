document.addEventListener('DOMContentLoaded',()=>{
    const taskInput=document.getElementById('task-input')
    const addTaskbtn=document.getElementById('add-task')
    const taskList=document.getElementById('task-list')
    const emptyImage=document.querySelector('.empty-img')
    const todosContainer=document.querySelector('.todos-container')
    const progressBar=document.getElementById('progress')
    const progressNumber=document.getElementById('numbers')


    const toggleEmptyState = () =>{
        emptyImage.style.display=taskList.children.length === 0 ? 'block':'none';
        todosContainer.style.width=taskList.children.length>0?'100%':'50%';
    }

    const updateProgress = (checkCompletion = true) =>{
        const totalTasks=taskList.children.length;
        const completedTasks=taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width=totalTasks ? `${(completedTasks/totalTasks)*100}%`:'0%'
        progressNumber.textContent=`${completedTasks} / ${totalTasks}`;
    }

    const saveTaskToLocalStorage = () => {
        const tasks = Arrays.from(taskList.querySelectorAll('li')).map(li => ({
            text : li.querySelector('span').textContent,
            completed : li.querySelector('.checkbox').checked
        }) );
        localStorage.setItem('tasks',JSON.stringify(tasks));
    }

    const loadTasksFromLocalStorage = () => {
        const savedTasks=JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({text,completed}) => addTask(text,completed,false));
        toggleEmptyState();
        updateProgress();
    }
    
    const addTask= (text, completed=false ,checkCompletion=true ) => {
        const taskText=text || taskInput.value.trim()
        if(!taskText) return;  

        const li=document.createElement('li')
        li.innerHTML=`
        <input type="checkbox" class="checkbox" 
        ${ completed ? 'checked': ''}/>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        ` 
        const checkbox=li.querySelector('.checkbox')
        const editbtn=li.querySelector('.edit-btn');

        if(completed){
            li.classList.add('completed');
            editbtn.disabled=true;
            editbtn.style.opacity='0.5';
            editbtn.style.pointerEvents='none';
        }

        checkbox.addEventListener('change',() =>{
            const isChecked = checkbox.checked;
            li.classList.toggle('completed',isChecked);
            editbtn.disabled=isChecked;
            editbtn.style.opacity=isChecked ? '0.5':'1';
            editbtn.style.pointerEvents=isChecked ? 'none':'auto';
            updateProgress();
            saveTaskToLocalStorage();
        })

        editbtn.addEventListener('click',() => {
            if(!checkbox.checked){
                taskInput.value=li.querySelector('span').textContent
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        })

        li.querySelector('.delete-btn').addEventListener('click',()=>{
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        })
        taskList.appendChild(li);
        taskInput.value=''
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    }   

    addTaskbtn.addEventListener('click',() => addTask());
    taskInput.addEventListener('keypress',(e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
                addTask();
        } 
    })
    loadTasksFromLocalStorage ();
})