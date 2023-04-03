import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const DATA = [
  {
    id: '0e2f0db1-5457-46b0-949e-8032d2f9997a',
    name: 'Walmart',
    items: [
      { id: '26fd50b3-3841-496e-8b32-73636f6f4197', name: '3% Milk' },
      { id: 'b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525', name: 'Butter' },
    ],
    tint: 1,
  },
  {
    id: '487f68b4-1746-438c-920e-d67b7df46247',
    name: 'Indigo',
    items: [
      {
        id: '95ee6a5d-f927-4579-8c15-2b4eb86210ae',
        name: 'Designing Data Intensive Applications',
      },
      { id: '5bee94eb-6bde-4411-b438-1c37fa6af364', name: 'Atomic Habits' },
    ],
    tint: 2,
  },
  {
    id: '25daffdc-aae0-4d73-bd31-43f73101e7c0',
    name: 'Lowes',
    items: [
      { id: '960cbbcf-89a0-4d79-aa8e-56abbc15eacc', name: 'Workbench' },
      { id: 'd3edf796-6449-4931-a777-ff66965a025b', name: 'Hammer' },
    ],
    tint: 3,
  },
];

const App = () => {
  const [stores, setStores] = useState(DATA);

  const handleDrapAndDdrop = (results) => {
    // source is the item start and destination is the item end
    const { source, destination, type } = results;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === 'group') {
      const reorderedStores = [...stores];
      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;
      // first we have to remove the element from where we start
      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      // removed store contains the element which is removed
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);
      // the above line puts the element where we put

      return setStores(reorderedStores);
    }

    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    const storeSourceIndex = stores.findIndex(
      (store) => store.id === source.droppableId
    );
    const storeDestinationIndex = stores.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newStores = [...stores];

    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems,
    };

    setStores(newStores);
  };

  return (
    <div className='layout__wrapper'>
      <div className='card'>
        <DragDropContext onDragEnd={handleDrapAndDdrop}>
          <div className='header'>
            <h1>Shopping List</h1>
          </div>
          <Droppable droppableId='ROOT' type='group'>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {stores.map((store, index) => (
                  <Draggable
                    draggableId={store.id}
                    index={index}
                    key={store.id}
                  >
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <StoreList
                          name={store.name}
                          items={store.items}
                          id={store.id}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {/* by default when we drag the element it is removed so that it space become empty which is bad user experience what this provided.placeholder it will add the placeholder button in the place of that draggable item */}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

function StoreList({ name, items, id }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className='store-container'>
            <h3>{name}</h3>
          </div>
          <div className='items-container'>
            {items.map((item, i) => (
              <Draggable draggableId={item.id} index={i} key={item.id}>
                {(provided) => (
                  <div
                    className='item-container'
                    key={item.id}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <h4>{item.name}</h4>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default App;
