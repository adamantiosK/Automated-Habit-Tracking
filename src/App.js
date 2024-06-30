import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { atomicHabitsApiService } from './data-access/atomicHabitsApiService';
import HelperService from './Helper/HelperService';

function App() {
  const [contextMenu, setContextMenu] = useState(null);
  const [habits, setHabits] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editAnimation, setEditAnimation] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const editCardRef = useRef(null);
  const helperService = new HelperService();

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

  const handleAction = async (action) => {
    if (action === 'edit') {
      setEditAnimation(true);
      setTimeout(() => {
        setEditMode(contextMenu.cardId);
        setEditAnimation(false);
      }, 300);
    }
    if (action === 'delete') {
      await handleDeleteCard(contextMenu.cardId);
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
      // Set pending update to trigger useEffect
      setPendingUpdate(editMode);
    }
  };

  const handleCardClick = (event, cardId) => {
    event.stopPropagation();
    setEditMode(cardId);
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

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (pendingUpdate) {
      const habitToUpdate = habits.find(habit => habit.id === pendingUpdate);
      if (habitToUpdate) {
        atomicHabitsApiService.updateHabit(habitToUpdate)
          .then(() => {
            setPendingUpdate(null);
          })
          .catch(error => {
            console.error('Error updating habit:', error);
          });
      }
    }
  }, [pendingUpdate, habits]);

  const fetchHabits = async () => {
    const loadedHabits = await atomicHabitsApiService.getAllHabits();
    setHabits(loadedHabits);
  };

  const handleTitleChange = (event, cardId) => {
    const newTitle = event.target.value;
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === cardId ? { ...habit, title: newTitle } : habit
      )
    );
  };

  const handleItemChange = (event, cardId, itemId) => {
    const newItemContent = event.target.value;
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === cardId
          ? {
              ...habit,
              items: habit.items.map((item) =>
                item.id === itemId ? { ...item, content: newItemContent } : item
              ),
            }
          : habit
      )
    );
  };

  const handleDeleteItem = async (cardId, itemId) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === cardId
        ? {
            ...habit,
            items: habit.items.filter((item) => item.id !== itemId),
          }
        : habit
    );

    try {
      await atomicHabitsApiService.deleteHabitItems(itemId);
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error updating habit items:', error);
    }
  };

  const handleAddItem = async (cardId) => {
    const newItem = { 
      id: helperService.getNewUUID(),
      content: '{ new item }'
    };

    const updatedHabits = habits.map((habit) =>
      habit.id === cardId
        ? {
            ...habit,
            items: [...habit.items, newItem],
          }
        : habit
    );

    try {
      await atomicHabitsApiService.addNewItemToCard(cardId, newItem);
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Error updating habit items:', error);
    }
  };

  const handleAddCard = async () => {
    const newUUID = helperService.getNewUUID();

    const newCard = {
      id: newUUID,
      title: '{New Habit}',
      items: []
    };

    try {
      await atomicHabitsApiService.addNewCard(newCard);

      setHabits((prevHabits) => [...prevHabits, newCard]);
      setEditAnimation(true);
      setTimeout(() => {
        setEditMode(newCard.id);
        setEditAnimation(false);
      }, 0);
    } catch (error) {
      console.error('Error adding new card:', error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const { error } = await atomicHabitsApiService.deleteCard(cardId);

      if (error) {
        console.error('Error deleting card:', error);
      } else {
        setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== cardId));
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
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
            onClick={(e) => handleCardClick(e, habit.id)}
            ref={editMode === habit.id ? editCardRef : null}
          >
            {editMode === habit.id ? (
              <>
                <input
                  type="text"
                  value={habit.title}
                  onChange={(e) => handleTitleChange(e, habit.id)}
                  className="edit-title"
                  onClick={(e) => e.stopPropagation()} // Prevent click from propagating
                />
                <div className="card-items">
                  {habit.items.map((item) => (
                    <div key={item.id} className="edit-item-container">
                      <input
                        type="text"
                        value={item.content}
                        onChange={(e) => handleItemChange(e, habit.id, item.id)}
                        className="edit-item"
                        onClick={(e) => e.stopPropagation()} // Prevent click from propagating
                      />
                      <button
                        className="delete-item-button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from propagating
                          handleDeleteItem(habit.id, item.id);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="add-item-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating
                    handleAddItem(habit.id);
                  }}
                >
                  Add Item
                </button>
              </>
            ) : (
              <>
                <div className="card-title">{habit.title}</div>
                <div className="card-items">
                  {habit.items.map((item) => (
                    <div key={item.id} className="card-item">
                      {item.content}
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
          <li onClick={() => handleAction('edit')}>Edit</li>
          <li onClick={() => handleAction('delete')}>Delete</li>
        </ul>
      ) : null}
    </div>
  );
}

export default App;
