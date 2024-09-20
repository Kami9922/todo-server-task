import { useEffect, useState } from 'react'
import styles from '../css/todo.module.css'
import TodoInput from './TodoInput'

const Todo = () => {
  const [todos, setTodos] = useState([])
  const [inputCreateValue, setInputCreateValue] = useState('')
  const [inputUpdateValue, setInputUpdateValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshTodosFlag, setRefreshTodosFlag] = useState(false)

  const refreshTodos = () => setRefreshTodosFlag(!refreshTodosFlag)

  const startEditingTodo = (id, title) => {
    setEditingTodoId(id)
    setInputUpdateValue(title)
  }

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
        setEditingTodoId(null)
        console.log(editingTodoId)

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
            {editingTodoId === id ? (
              <form
                onSubmit={() => {
                  updateTodo(id)
                }}
              >
                <input
                  value={inputUpdateValue}
                  onChange={({ target }) => {
                    setInputUpdateValue(target.value)
                  }}
                ></input>
                <button disabled={isUpdating} type='submit'>
                  Применить
                </button>
              </form>
            ) : (
              title
            )}
            <div>
              <button
                className={editingTodoId === id ? styles.hidden : ''}
                onClick={() => startEditingTodo(id, title)}
              >
                Изменить
              </button>

              <button disabled={isDeleting} onClick={() => deleteTodo(id)}>
                Удалить
              </button>
            </div>
          </div>
        ))
      )}
    </>
  )
}

export default Todo
