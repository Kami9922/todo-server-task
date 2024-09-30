import React from 'react'
import styles from '../css/todolist.module.css'

const Todo = ({
  id,
  title,
  setInputUpdateValue,
  isUpdating,
  inputUpdateValue,
  updateTodo,
  editingTodoId,
  startEditingTodo,
  deleteTodo,
  isDeleting,
}) => {
  return (
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
          <button className='custom-button' disabled={isUpdating} type='submit'>
            Применить
          </button>
        </form>
      ) : (
        title
      )}
      <div>
        <button
          className={editingTodoId === id ? styles.hidden : 'custom-button'}
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
  )
}

export default Todo
