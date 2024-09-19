import styles from '../css/todoInput.module.css'

const TodoInput = ({
  inputCreateValue,
  setInputCreateValue,
  refreshTodos,
  setIsCreating,
  isCreating,
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
      .then((response) => {
        console.log('Дело добавлено!', response)

        refreshTodos()
      })
      .finally(() => setIsCreating(false))
      .finally(() => setInputCreateValue(''))
  }

  return (
    <>
      <form className={styles['todo-input']} onSubmit={createTodo}>
        <input
          name='todo-title'
          type='text'
          value={inputCreateValue}
          onChange={({ target }) => {
            setInputCreateValue(target.value)
          }}
        ></input>
        <button disabled={isCreating} type='submit'>
          Добавить дело
        </button>
      </form>
    </>
  )
}

export default TodoInput
