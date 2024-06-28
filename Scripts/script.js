function addTask() {
    var taskName = document.getElementById('taskName').value;
    var taskDue = document.getElementById('taskDue').value;
    var taskPerson = document.getElementById('taskPerson').value;

    if (taskName && taskDue && taskPerson) {
        var task = {
            name: taskName,
            due: taskDue,
            person: taskPerson,
            id: new Date().getTime()
        };

        var taskElement = createTaskElement(task);
        document.getElementById('pendingTasks').appendChild(taskElement);
        clearInputs();
    } else {
        alert('Please fill in all fields.');
    }
}

function createTaskElement(task) {
    var taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.draggable = true;
    taskElement.dataset.id = task.id;
    taskElement.innerHTML = 
        '<div>Name: ' + task.name + '</div>' +
        '<div>Due: ' + task.due + ' </div>' +
        '<div>Person: ' + task.person + '</div>';

    taskElement.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', taskElement.dataset.id);
        taskElement.classList.add('dragging');
    });

    taskElement.addEventListener('dragend', function() {
        taskElement.classList.remove('dragging');
    });

    return taskElement;
}

function clearInputs() {
    document.getElementById('taskName').value = '';
    document.getElementById('taskDue').value = '';
    document.getElementById('taskPerson').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    var sections = document.querySelectorAll('.pending, .completed');

    sections.forEach(function(section) {
        section.addEventListener('dragover', function(event) {
            event.preventDefault();
        });

        section.addEventListener('drop', function(event) {
            event.preventDefault();
            var draggingTaskId = event.dataTransfer.getData('text/plain');
            var draggingTask = document.querySelector('.task[data-id="' + draggingTaskId + '"]');
            if (draggingTask) {
                section.querySelector('div').appendChild(draggingTask);
                if (section.classList.contains('completed')) {
                    draggingTask.classList.add('completed');
                } else {
                    draggingTask.classList.remove('completed');
                }
            }
        });
    });

    setInterval(checkOverdueTasks, 60000);
});

function checkOverdueTasks() {
    var now = new Date();
    var tasks = document.querySelectorAll('.task');
    tasks.forEach(function(task) {
        var dueDate = new Date(task.querySelector('div:nth-child(2)').innerText.split(' ')[1]);
        if (dueDate < now && !task.classList.contains('completed')) {
            document.getElementById('overdueTasks').appendChild(task);
            task.classList.add('overdue');
        } else if (dueDate >= now && task.classList.contains('overdue')) {
            task.classList.remove('overdue');
            document.getElementById('pendingTasks').appendChild(task);
        }
    });
}
