import React, {useState,useRef,useEffect} from "react" ;
import Form from "./components/Form";
import Todo from "./components/Todo";
import FilterButton from "./components/FilterButton";
import {nanoid} from 'nanoid';


const Filter_Map ={
  All: () => true,
  Active : task => !task.completed,
  completed: task => task.completed,

}
const Filter_Names = Object.keys(Filter_Map);
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App(props) {
  const[tasks, setTasks] = useState(props.tasks);
  function addTask(name) {
    const newTask = {id:'todo-'+ nanoid(), name: name, completed: false };
    

    setTasks([...tasks, newTask]);
  
  
  }
  function toggleTaskCompleted(id) {
    const UpdatedTask =tasks.map(task =>{
      if(id === task.id)
      {
        return { ...task, completed : !task.completed}
      }
      return task;
     }
    );
    setTasks(UpdatedTask);
    
  }
  function deleteTask(id) {
    const remainingTask = tasks.filter(task => id !== task.id);
    setTasks(remainingTask);
  }
  function editTask(id, newName) {
    const editTask = tasks.map(task =>{
      if (id === task.id){
        
        return {...task, name: newName}

      }
      return task;
    })
    setTasks(editTask);

    
  }
  const [filter, setFilter] = useState('All');
  const filterList = Filter_Names.map(name => (
    <FilterButton 
     key ={name} 
     name = {name}
     isPressed = {name === filter}
     setFilter = {setFilter}
    />
  ));
  const taskList = tasks
  .filter(Filter_Map[filter]).map(task => (
   <Todo
    id = {task.id } 
    name = {task.name} 
    completed = {task.completed}
    key ={task.id}  
    toggleTaskCompleted ={toggleTaskCompleted}
    deleteTask = {deleteTask}
    editTask = {editTask}
    />
  
    )
  );
  
  const taskNoun = taskList.length <=1 ? 'task':'tasks';
  const headingText = `${taskList.length} ${taskNoun} remaining`;
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);
  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);
  return (
    <div className="todoapp stack-large">
      <Form addTask= {addTask}/>
    
      <div className="filters btn-group stack-exception">
      {filterList}
      </div>
      <h2 id="list-heading" tabIndex = '-1' ref = {listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
      {taskList}
            
      
      </ul>
    </div>
  );
} 
export default App;
