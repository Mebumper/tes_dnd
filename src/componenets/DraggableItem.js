import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const DraggableItem = ({ item, index }) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            margin: '5px',
            padding: '5px',
            border: '1px solid #aaa',
            backgroundColor: '#f9f9f9',
            cursor: 'pointer',
            ...provided.draggableProps.style,
          }}
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableItem;
