/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import cn from 'classnames';

export const App: React.FC = () => {
  const [userTodo, setUserTodo] = useState<Todo[]>([]);
  const [errorMassage, setErrorMassage] = useState('');
  const [sortTodo, setsortTodo] = useState('all');

  useEffect(() => {
    getTodos()
      .then(setUserTodo)
      .catch(() => {
        setErrorMassage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMassage) {
      const timer = setTimeout(() => setErrorMassage(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMassage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const sotrUserTodo = userTodo.filter(todo => {
    if (sortTodo === 'all') {
      return true;
    }

    if (sortTodo === 'active') {
      return todo.completed === false;
    }

    if (sortTodo === 'completed') {
      return todo.completed === true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {sotrUserTodo.map(listTodo => (
            <div
              key={listTodo.id}
              data-cy="Todo"
              className={`todo ${listTodo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={listTodo.completed}
                  readOnly
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {listTodo.title}
              </span>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {userTodo.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {userTodo.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className="filter__link selected"
                data-cy="FilterLinkAll"
                onClick={() => setsortTodo('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className="filter__link"
                data-cy="FilterLinkActive"
                onClick={() => setsortTodo('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className="filter__link"
                data-cy="FilterLinkCompleted"
                onClick={() => setsortTodo('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMassage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMassage('')}
        />
        {/* show only one message at a time */}
        {errorMassage}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
