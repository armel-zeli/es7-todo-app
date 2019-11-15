'use strict'

/**
 * Fetch existing todos from localStorage
 * @returns {Array|any}
 */
const getSavedTodos = () => {
    const todosJSON = localStorage.getItem('todos')

    try {
        return todosJSON ? JSON.parse(todosJSON) : []
    } catch (e) {
        return []
    }

}

/**
 * Save todos to localStorage
 * @param todos
 */
const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
}

/**
 * Render application todos
 * @param todos
 * @param filters
 */
const renderTodos = (todos, filters) => {

    const filteredTodos = todos.filter((todo) => {
        const searchTextMatch = todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
        const hideCompletedMatch = !filters.hideCompleted || !todo.completed

        return searchTextMatch && hideCompletedMatch
    })

    const incompleteTodos = filteredTodos.filter((todo) => !todo.completed)
    const todoEl = document.querySelector('#todos')
    todoEl.innerHTML = ''
    todoEl.appendChild(generateSummaryDOM(incompleteTodos))

    if(filteredTodos.length > 0){
        filteredTodos.forEach((todo) => {
            todoEl.appendChild(generateTodoDOM(todo))
        })
    } else {
        let emptyTodo = document.createElement('p')
        emptyTodo.textContent = 'Aucune todo pour le moment'
        emptyTodo.classList.add('empty-message')
        todoEl.appendChild(emptyTodo)
    }

}

/**
 * Remove from todo list
 *
 * @param id
 */
const removeTodo = (id) => {
    const todoIndex = todos.findIndex((todo) => todo.id === id)

    if (todoIndex > -1) {
        todos.splice(todoIndex, 1)
    }
}
/**
 * Toggle the completed value for a given todo
 *
 * @param id
 */
const toggleTodo = (id) => {
    const todo = todos.find((todo) => todo.id === id)

    if (todo) {
        todo.completed = !todo.completed
    }
}
/**
 *Generate a DOM structure for a todo
 *
 * @param todo
 * @returns {HTMLDivElement}
 */
const generateTodoDOM = (todo) => {
    const todoEl = document.createElement('label')
    const containerEl = document.createElement("div")
    const todoText = document.createElement('span')
    const checkBox = document.createElement('input')
    const removeButton = document.createElement('button')

    //Setup checkbox
    checkBox.setAttribute('type', 'checkbox')
    checkBox.checked = todo.completed
    containerEl.appendChild(checkBox)
    checkBox.addEventListener('change', () => {
        toggleTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters)
    })

    //Setup text
    todoText.textContent = todo.text
    containerEl.appendChild(todoText)

    //Setup container
    todoEl.classList.add('list-item')
    containerEl.classList.add('list-item__container')
    todoEl.appendChild(containerEl)

    //Setup remove button
    removeButton.textContent = 'supprimer'
    removeButton.classList.add('button',)
    todoEl.appendChild(removeButton)
    removeButton.addEventListener('click', () => {
        removeTodo(todo.id)
        saveTodos(todos)
        renderTodos(todos, filters)
    })

    return todoEl
}

/**
 * Generate a summary for a todo application
 * @param incompleteTodos
 * @returns {HTMLHeadingElement}
 */
const generateSummaryDOM = (incompleteTodos) => {
    const summary = document.createElement("h2")

    summary.classList.add('list-title')
    summary.textContent = `Il te reste ${incompleteTodos.length}`+(incompleteTodos.length > 1 ? " todos" : " todo") + " à faire"

    return summary
}