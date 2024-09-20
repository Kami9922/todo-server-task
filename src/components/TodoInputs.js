import styles from '../css/todoInputs.module.css'

const TodoInput = ({
  inputCreateValue,
  setInputCreateValue,
  refreshTodos,
  setIsCreating,
  isCreating,
  isSearching,
  setInputSearchValue,
}) => {
  const createTodo = (e) => {
    e.preventDefault()
    setIsCreating(true)

    fetch('http://localhost:3005/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        userId: 1,
        id: new Date().valueOf(),
        title: inputCreateValue,
        completed: false,
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then(() => {
        refreshTodos()
      })
      .finally(() => setIsCreating(false))
      .finally(() => setInputCreateValue(''))
  }

  return (
    <div className={styles['inputs-header']}>
      {isSearching ? (
        <input
          placeholder='Поиск дела...'
          className={styles['todo-input']}
          onChange={({ target }) => {
            setInputSearchValue(target.value)
          }}
        ></input>
      ) : (
        <form className={styles['todo-input']} onSubmit={createTodo}>
          <input
            placeholder='Создайте дело...'
            name='todo-title'
            type='text'
            value={inputCreateValue}
            onChange={({ target }) => {
              setInputCreateValue(target.value)
            }}
          ></input>
          <button className='custom-button' disabled={isCreating} type='submit'>
            Добавить дело
          </button>
        </form>
      )}
    </div>
  )
}

export default TodoInput
