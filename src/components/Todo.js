import { useEffect, useState } from 'react'
import styles from '../css/todo.module.css'

const Todo = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((loadedData) => loadedData.json())
      .then((loadedTodos) => {
        setTodos(loadedTodos)
      })
  }, [])
  console.log(todos)

  return (
    <>
      <div className={styles['main-title']}>Todo</div>
      {todos.map(({ id, title }) => (
        <div className={styles.todo} key={id}>
          {title}
        </div>
      ))}
    </>
  )
}

export default Todo
