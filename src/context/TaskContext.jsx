import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { mockApi } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  loading: true,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'OPTIMISTIC_ADD':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'OPTIMISTIC_UPDATE':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        ),
      };
    case 'OPTIMISTIC_DELETE':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case 'ROLLBACK':
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { isAuthenticated, handleUnauthorized } = useAuth();

  const handleApiError = useCallback(
    (err) => {
      if (err?.status === 401) {
        handleUnauthorized();
        return;
      }
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Xəta baş verdi' });
    },
    [handleUnauthorized]
  );

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'FETCH_SUCCESS', payload: [] });
      return;
    }
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await mockApi.getTasks();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      handleApiError(err);
    }
  }, [isAuthenticated, handleApiError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    const previous = [...state.tasks];
    const tempId = `temp-${Date.now()}`;
    dispatch({ type: 'OPTIMISTIC_ADD', payload: { ...taskData, id: tempId } });
    try {
      await mockApi.createTask(taskData);
      await fetchTasks();
    } catch (err) {
      dispatch({ type: 'ROLLBACK', payload: previous });
      handleApiError(err);
    }
  };

  const updateTask = async (id, data) => {
    const previous = [...state.tasks];
    dispatch({ type: 'OPTIMISTIC_UPDATE', payload: { id, data } });
    try {
      await mockApi.updateTask(id, data);
    } catch (err) {
      dispatch({ type: 'ROLLBACK', payload: previous });
      handleApiError(err);
    }
  };

  const deleteTask = async (id) => {
    const previous = [...state.tasks];
    dispatch({ type: 'OPTIMISTIC_DELETE', payload: id });
    try {
      await mockApi.deleteTask(id);
    } catch (err) {
      dispatch({ type: 'ROLLBACK', payload: previous });
      handleApiError(err);
    }
  };

  return (
    <TaskContext.Provider
      value={{ ...state, addTask, updateTask, deleteTask, fetchTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
