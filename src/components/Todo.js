import { useEffect, useState } from 'react'
import styles from '../css/todo.module.css'
import TodoInputs from './TodoInputs'

const Todo = () => {
  //Отображение
  const [todos, setTodos] = useState([])
  //Создание
  const [inputCreateValue, setInputCreateValue] = useState('')
  //Изменение
  const [inputUpdateValue, setInputUpdateValue] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState(null)
  //Блокировка кнопок
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  //Флаг обновления компонента для useEffect
  const [refreshTodosFlag, setRefreshTodosFlag] = useState(false)
  //Поиск
  const [isSearching, setIsSearching] = useState(false)
  const [inputSearchValue, setInputSearchValue] = useState('')
  const [filteredTodos, setFilteredTodos] = useState([])
  //Сортировка
  const [isSortedAlphabetically, setIsSortedAlphabetically] = useState(false)

  const refreshTodos = () => setRefreshTodosFlag(!refreshTodosFlag)

  const sortTodosAlphabetically = () => {
    setIsSortedAlphabetically(!isSortedAlphabetically)
  }

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
        setFilteredTodos(loadedTodos)
      })
      .finally(() => setIsLoading(false))
  }, [refreshTodosFlag])

  useEffect(() => {
    const handleSearchAndSort = (searchValue) => {
      let filtered = todos

      if (searchValue) {
        filtered = todos.filter((todo) =>
          todo.title.toLowerCase().includes(searchValue.toLowerCase())
        )
      }

      if (isSortedAlphabetically) {
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
      }

      setFilteredTodos(filtered)
    }

    handleSearchAndSort(inputSearchValue)
  }, [inputSearchValue, todos, isSortedAlphabetically])

  const updateTodo = (id) => {
    setIsUpdating(true)

    fetch(`http://localhost:3005/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        title: inputUpdateValue,
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log('Дело изменено!', response)
        setEditingTodoId(null)

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
    <div className={styles['todo-container']}>
      <button
        className={isSearching ? styles['search-active'] : styles.search}
        onClick={() => setIsSearching(!isSearching)}
      >
        Поиск дела
      </button>
      <TodoInputs
        inputSearchValue={inputSearchValue}
        setInputSearchValue={setInputSearchValue}
        setIsSearching={setIsSearching}
        isSearching={isSearching}
        setIsCreating={setIsCreating}
        isCreating={isCreating}
        refreshTodos={refreshTodos}
        setInputCreateValue={setInputCreateValue}
        inputCreateValue={inputCreateValue}
      />
      <button
        onClick={sortTodosAlphabetically}
        className={styles['sort-button']}
      >
        {isSortedAlphabetically
          ? 'Отсортировать по алфавиту'
          : 'Отсортировать по алфавиту'}
      </button>
      {isLoading ? (
        <div className={styles.loader}></div>
      ) : (
        filteredTodos.map(({ id, title }) => (
          <div className={styles.todo} key={id}>
            {editingTodoId === id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  updateTodo(id)
                }}
              >
                <input
                  placeholder='Поменяйте дело...'
                  value={inputUpdateValue}
                  onChange={({ target }) => {
                    setInputUpdateValue(target.value)
                  }}
                ></input>
                <button
                  className='custom-button'
                  disabled={isUpdating}
                  type='submit'
                >
                  Применить
                </button>
              </form>
            ) : (
              title
            )}
            <div>
              <button
                className={
                  editingTodoId === id ? styles.hidden : 'custom-button'
                }
                onClick={() => startEditingTodo(id, title)}
              >
                Изменить
              </button>

              <button
                className='custom-button'
                disabled={isDeleting}
                onClick={() => deleteTodo(id)}
              >
                Выполнено
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Todo
