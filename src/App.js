import './App.css'

import TodoList from './components/TodoList'

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <div className='main-title'>TODO</div>
        <TodoList />
      </header>
    </div>
  )
}

export default App
