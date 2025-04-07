import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    const {food_list} = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        <div className="food-display-list">
            {food_list.map((item, index)=>{
              if(category==="All"|| category===item.category){
                return <FoodItem key={index} id={item._id} name = {item.name} description={item.description} price={item.price} image={item.image} />
              }
                
            })}
        </div>
    </div>
  )
}
export default FoodDisplay

// import React, { useContext } from 'react';
// import './FoodDisplay.css';
// import { StoreContext } from '../../context/StoreContext';

// const FoodDisplay = ({ category }) => {
//     const { food_list } = useContext(StoreContext);

//     // Ensure food_list exists before filtering
//     const filteredFood = food_list?.filter(food => food.category === category) || [];

//     return (
//         <div className='food-display' id='food-display'>
//             <h2>Top dishes near you</h2>
//             <div className='food-list'>
//                 {filteredFood.length > 0 ? (
//                     filteredFood.map(food => (
//                         <div key={food.id} className='food-item'>
//                             <img src={food.image} alt={food.name} />
//                             <h3>{food.name}</h3>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No dishes available</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FoodDisplay;
