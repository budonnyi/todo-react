import React from 'react'
import ReactDOM from 'react-dom'

import AppHeader from '../app-header/'
import SearchPanel from '../search-panel/'
import TodoList from '../todo-list/'
import ItemStatusFilter from '../item-status-filter/'

import './App.css'

const App = () => {

    const todoData = [
        {label: 'Drink Coffee', important: false, id: 1},
        {label: 'Do the Aliks site', important: true, id: 2},
        {label: 'Renkas birthday', important: false, id: 3}
    ]

    return (
        <div className='todo-app'>
            <AppHeader toDo={1} done={3}/>
            <div className='top-panel d-flex'>
                <SearchPanel/>
                <ItemStatusFilter/>
            </div>
            <TodoList todos={todoData}/>
        </div>
    )
}

export default App
