import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [contextMenu, setContextMenu] = useState(null);
  const [habits, setHabits] = useState([
    {
      id: 1,
      title: 'My Habit',
      items: ['Item 1', 'Item 2', 'Item 3'],
    },
    {
      id: 2,
      title: 'Another Habit',
      items: ['Item A', 'Item B', 'Item C'],
    },
    {
      id: 3,
      title: 'New Habit',
      items: ['Task 1', 'Task 2'],
    },
  ]);
  const [editMode, setEditMode] = useState(null);
  const [editAnimation, setEditAnimation] = useState(false);
  const editCardRef = useRef(null);

  const handleContextMenu = (event, cardId) => {
    event.preventDefault();
    if (editMode !== cardId) {
      setContextMenu({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        cardId: cardId,
      });
    }
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleAction = (action) => {
    if (action === 'edit') {
      setEditAnimation(true);
      setTimeout(() => {
        setEditMode(contextMenu.cardId);
        setEditAnimation(false);
      }, 300);
    }
    handleClose();
  };

  const handleClickOutside = (event) => {
    if (editCardRef.current && !editCardRef.current.contains(event.target)) {
      setEditAnimation(true);
      setTimeout(() => {
        setEditMode(null);
        setEditAnimation(false);
      }, 300);
    }
  };

  const handleCardClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (editMode !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editMode]);

  const handleTitleChange = (event, cardId) => {
    const newTitle = event.target.value;
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === cardId ? { ...habit, title: newTitle } : habit
      )
    );
  };

  const handleItemChange = (event, cardId, index) => {
    const newItem = event.target.value;
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === cardId
          ? {
              ...habit,
              items: habit.items.map((item, i) =>
                i === index ? newItem : item
              ),
            }
          : habit
      )
    );
  };

  const handleDeleteItem = (cardId, index) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === cardId
          ? {
              ...habit,
              items: habit.items.filter((_, i) => i !== index),
            }
          : habit
      )
    );
  };

  const handleAddItem = (cardId) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === cardId
          ? {
              ...habit,
              items: [...habit.items, ''],
            }
          : habit
      )
    );
  };

  const handleAddCard = () => {
    const newCard = {
      id: habits.length + 1,
      title: '',
      items: [],
    };
    setHabits((prevHabits) => [...prevHabits, newCard]);
    setEditAnimation(true);
    setTimeout(() => {
      setEditMode(newCard.id);
      setEditAnimation(false);
    }, 300);
  };

  return (
    <div className="App" onContextMenu={(e) => e.preventDefault()}>
      <nav className="navbar">
        <div className="title">Habit Tracker</div>
        <div className="login">Login</div>
      </nav>
      <div className="container">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`card habit-card ${editMode === habit.id ? 'edit-mode' : ''} ${editAnimation && editMode === habit.id ? 'animate' : ''}`}
            onContextMenu={(e) => handleContextMenu(e, habit.id)}
            onClick={handleCardClick}
            ref={editMode === habit.id ? editCardRef : null}
          >
            {editMode === habit.id ? (
              <>
                <input
                  type="text"
                  value={habit.title}
                  onChange={(e) => handleTitleChange(e, habit.id)}
                  className="edit-title"
                  onClick={handleCardClick}
                />
                <div className="card-items">
                  {habit.items.map((item, index) => (
                    <div key={index} className="edit-item-container">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleItemChange(e, habit.id, index)}
                        className="edit-item"
                        onClick={handleCardClick}
                      />
                      <button
                        className="delete-item-button"
                        onClick={() => handleDeleteItem(habit.id, index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="add-item-button"
                  onClick={() => handleAddItem(habit.id)}
                >
                  Add Item
                </button>
              </>
            ) : (
              <>
                <div className="card-title">{habit.title}</div>
                <div className="card-items">
                  {habit.items.map((item, index) => (
                    <div key={index} className="card-item">
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
        <div className="card add-card" onClick={handleAddCard}>
          <div className="plus-sign">+</div>
        </div>
      </div>
      {contextMenu ? (
        <ul
          className="context-menu"
          style={{
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
          }}
          onMouseLeave={handleClose}
        >
          <li onClick={() => handleAction('copy')}>Copy Endpoint</li>
          <li onClick={() => handleAction('edit')}>Edit</li>
          <li onClick={() => handleAction('delete')}>Delete</li>
        </ul>
      ) : null}
    </div>
  );
}

export default App;
