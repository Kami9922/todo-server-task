import { useEffect, useState } from 'react'
import styles from '../css/todo.module.css'
import TodoInput from './TodoInput'

const Todo = () => {
  const [todos, setTodos] = useState([])
  const [inputCreateValue, setInputCreateValue] = useState([])
  const [inputUpdateValue, setInputUpdateValue] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  // const [isChanging, setIsChanging] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshTodosFlag, setRefreshTodosFlag] = useState(false)
  // const [isDone, setIsDone] = useState(false)

  const refreshTodos = () => setRefreshTodosFlag(!refreshTodosFlag)

  useEffect(() => {
    setIsLoading(true)

    fetch('http://localhost:3005/todos')
      .then((loadedData) => loadedData.json())
      .then((loadedTodos) => {
        setTodos(loadedTodos)
      })
      .finally(() => setIsLoading(false))
  }, [refreshTodosFlag])

  const updateTodo = (id) => {
    setIsUpdating(true)

    fetch(`http://localhost:3005/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        title: inputUpdateValue,
        completed: false ? true : false,
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log('Дело изменено!', response)

        refreshTodos()
      })
      .finally(() => setIsUpdating(false))
  }

  const deleteTodo = (id) => {
    setIsDeleting(true)

    fetch(`http://localhost:3005/todos/${id}`, {
      method: 'DELETE',
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log('Дело удалено!', response)

        refreshTodos()
      })
      .finally(() => setIsDeleting(false))
  }

  return (
    <>
      <TodoInput
        setIsCreating={setIsCreating}
        isCreating={isCreating}
        refreshTodos={refreshTodos}
        setInputCreateValue={setInputCreateValue}
        inputCreateValue={inputCreateValue}
      />
      {isLoading ? (
        <div className={styles.loader}></div>
      ) : (
        todos.map(({ id, title }) => (
          <div className={styles.todo} key={id}>
            {!1 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  updateTodo(id)
                }}
              >
                <input
                  value={inputUpdateValue}
                  onChange={({ target }) => {
                    setInputUpdateValue(target.value)
                  }}
                ></input>
              </form>
            ) : (
              title
            )}
            <div>
              {!1 ? (
                <button type='submit' onClick={() => console.log(id)}>
                  Применить
                </button>
              ) : (
                <button onClick={() => !1}>Изменить</button>
              )}
              <button onClick={() => deleteTodo(id)}>Удалить</button>
            </div>
          </div>
        ))
      )}
    </>
  )
}

export default Todo
