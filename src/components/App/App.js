import React, {Component} from 'react'
// import ReactDOM from 'react-dom'

import AppHeader from '../app-header/'
import SearchPanel from '../search-panel/'
import TodoList from '../todo-list/'
import ItemStatusFilter from '../item-status-filter/'
import ItemAddForm from '../item-add-form'

import './App.css'

export default class App extends Component {

    maxId = 100;

    state = {

        // todoData: [
        //     this.createTodoItem('Drink Coffee'),
        //     this.createTodoItem('Done ToDo application'),
        //     this.createTodoItem('Make five React apps'),
        //     this.createTodoItem('Learn Node JS'),
        //     this.createTodoItem('Done PHP REST api')
        // ],

        todoData: [{

        }],
        term: '',
        filter: 'all' //active, all, done
    }


    componentDidMount() {
        if (this.state.todoData) {
            this.loadTodos();
            console.log('loaded')
        }
    }


    loadTodos = async () => {

        const res = await fetch('http://backend/todo')
        const body = await res.json()

        console.log('body = ', body)

        this.setState(({todoData}) => {

            const newArray = [
                ...todoData,
                ...body
            ]

            return {
                todoData: newArray
            }

        })

        return true
    }

    createTodoItem(label) {
        return {
            id: this.maxId++,
            label: label,
            important: false,
            done: false
        }
    }

    deleteItem = (id) => {



        const requestUrl = 'http://backend/todo' + `?id=${id}`;
        const {todoData} = this.state;

        fetch(requestUrl, {method: 'DELETE'})
            .then(res => {
                const {status} = res;

                if (status < 200 || status > 299) {
                    throw new Error(`Ошибка при удалении! Код: ${status}`);
                }

                const cleanTodoData = todoData.filter(todo => todo.id !== id);
                this.setState({todoData: cleanTodoData});

                alert(`Задача с id: ${id} удалена!`);
            })
            .catch(error => {
                console.log('catch error');
                console.error(error);
            });



        this.setState(({todoData}) => {

            const idx = todoData.findIndex((el) => el.id === id)

            const newArray = [
                ...todoData.slice(0, idx),
                ...todoData.slice(idx + 1)
            ]

            return {
                todoData: newArray
            }
        })
    }

    onAddItem = (text) => {

        const newItem = this.createTodoItem(text)

        this.setState(({todoData}) => {

            const newArray = [
                ...todoData,
                newItem
            ]

            return {
                todoData: newArray
            }

        })
    }



    toggleProperty(arr, id, propName) {

        const idx = arr.findIndex((el) => el.id === id)

        const oldItem = arr[idx]
        const newItem = {
            ...oldItem,
            [propName]: !oldItem[propName]
        }

        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ]
    }

    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            }
        })
    }

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        })
    }

    search(items, term) {

        if (term.length === '') {
            return items;
        }

        return items.filter((item) => {
            return item.label
                .toLowerCase()
                .indexOf(term.toLowerCase()) > -1
        })
    }

    onSearchChange = (term) => {
        this.setState({term})
    }

    filter(items, filter) {

        switch (filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
                return items;
        }
    }

    onFilterChange = (filter) => {
        this.setState({filter})
    }

    render() {

        const {todoData, term, filter} = this.state

        const visibleItems = this.filter(
            this.search(todoData, term), filter)

        const doneCount = this.state.todoData
            .filter((el) => el.done).length

        const todoCount = this.state.todoData.length - doneCount

        return (

            <div className='todo-app'>
                <AppHeader toDo={todoCount} done={doneCount}/>

                <div className='top-panel d-flex'>
                    <SearchPanel
                        onSearchChange={this.onSearchChange}
                    />
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}
                    />
                </div>

                <TodoList
                    todos={visibleItems}
                    onDeleted={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}
                />

                <ItemAddForm
                    onAddItem={this.onAddItem}
                />
            </div>

        )
    }
}
