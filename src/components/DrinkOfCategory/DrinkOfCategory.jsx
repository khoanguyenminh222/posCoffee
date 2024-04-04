import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faDroplet } from '@fortawesome/free-solid-svg-icons';

function DrinkOfCategory({ category }) {


  return (
    <div className="flex flex-col overflow-auto w-1/5 mr-4 max-h-screen" style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray', scrollbarTrackColor: 'rgba(0, 0, 0, 0.1)' }}>
      {category.drinks.map(drink => (
        <Category key={drink._id} category={category} drink={drink} storage={storage} />
      ))}
    </div>
  );
}

export default DrinkOfCategory;
