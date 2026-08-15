import React from 'react';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { mockApi } from '../services/api';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  loading: true,
  error: null
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'OPTIMISTIC_ADD':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'OPTIMISTIC_UPDATE':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload.data } : t)
      };
    case 'OPTIMISTIC_DELETE':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      };
    case 'ROLLBACK':
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = async () => {
    try {
      const data = await mockApi.getTasks();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskData) => {
    const previousTasks = [...state.tasks];
    const tempId = Date.now().toString();
    const tempTask = { ...taskData, id: tempId };
    dispatch({ type: 'OPTIMISTIC_ADD', payload: tempTask });
    try {
      await mockApi.createTask(taskData);
      await fetchTasks();
    } catch (err) {
      dispatch({ type: 'ROLLBACK', payload: previousTasks });
      alert('Xəta: Əməliyyat geri qaytarıldı');
    }
  };

  const updateTask = async (id, data) => {
    const previousTasks = [...state.tasks];
    dispatch({ type: 'OPTIMISTIC_UPDATE', payload: { id, data } });
    try {
      await mockApi.updateTask(id, data);
    } catch (err) {
      dispatch({ type: 'ROLLBACK', payload: previousTasks });
    }
  };

  const deleteTask = async (id) => {
    const previousTasks = [...state.tasks];
    dispatch({ type: 'OPTIMISTIC_DELETE', payload: id });
    try {
      await mockApi.deleteTask(id);
    } catch (err) {
      dispatch({ type: 'ROLLBACK', payload: previousTasks });
    }
  };

  return (
    <TaskContext.Provider value={{ ...state, addTask, updateTask, deleteTask, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
