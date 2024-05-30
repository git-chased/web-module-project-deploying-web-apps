import React, {useState, useEffect} from 'react'
import './App.css'

function App(){
    const [plants, setPlants] = useState([]);
    const [plantName, setPlantName] = useState('')
    const [waterInterval, setWaterInterval] = useState(0)
    const [editingPlants, setEditingPlant] = useState(null)


useEffect(() => {
    const interval = setInterval(() =>{
        setPlants(plants => 
            plants.map(plant => ({
                ...plant, 
                daysLeft: plant.daysLeft > 0 ? plant.daysLeft - 1 : plant.daysLeft,
            }))    
            )
    }, 86400000);
    return () => clearInterval(interval)
}, []);

const addPlant = () => {
    if (!plantName || waterInterval <= 0) return;

    setPlants([...plants, {
        id: Date.now(),
        name: plantName,
        daysLeft: waterInterval,
        waterInterval,
    }])
    setPlantName('')
    setWaterInterval(0)
}

const editPlant = (id) => {
    const plantToEdit = plants.find(plant => plant.id === id)
    setPlantName(plantToEdit.name)
    setWaterInterval(plantToEdit.waterInterval)
    setEditingPlant(id)
}

const savePlant = () => {
    setPlants(plants.map(plant => (
        plant.id === editingPlants
            ?{...plant, name: plantName, waterInterval, daysLeft: waterInterval}
            : plant
    )))
    setPlantName('')
    setWaterInterval(0)
    setEditingPlant(null)
}

const deletePlant = (id) => {
    setPlants(plants.filter(plant => plant.id !== id))
}

const resetWatering = (id) => {
    setPlants(plants.map(plant => (
        plant.id === id
            ? {...plant, daysLeft: plant.waterInterval}
            : plant
    )))
}

return (
    <div className='App'>
        <h1>Plant Watering Schedule</h1>
        <div>
            <input
                type='text'
                placeholder='Plant Name'
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
            />
            <input
                type='number'
                placeholder='Days between watering'
                value={waterInterval}
                onChange={(e) => setWaterInterval(Number(e.target.value))}
            />
            {editingPlants ? (
                <button onClick={savePlant}>Save</button>
            ) : (
                <button onClick={addPlant}>Add Plant</button>
            )}
        </div>
        <ul>
            {plants.map(plant => (
                <li key={plant.id} style={{color: plant.daysLeft <= 1 ? 'red' : 'black'}}>
                    {plant.name} -Water in {plant.daysLeft} day{plant.daysLeft !== 1 ? 's' : ''}
                    <button onClick={() => resetWatering(plant.id)}>Watered</button>
                    <button onClick={() => editPlant(plant.id)}>Edit</button>
                    <button onClick={() => deletePlant(plant.id)}>Delete</button>
                </li>
            ))}
        </ul>
    </div>
)
            }
            
export default App