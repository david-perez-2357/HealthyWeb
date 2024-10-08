import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Link, useParams} from "react-router-dom";
import RecipeHeader from "../components/RecipeHeader.jsx";
import {getInformationRecipe} from "../services/recipeService.js";
import Loading from "../components/Loading.jsx";
import Error from "../components/Error.jsx";
import IngredientTypeGroup from "../components/IngredientTypeGroup.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import CaloriesMeter from "../components/CaloriesMeter.jsx";


function Recipe () {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [caloriesType, setCaloriesType] = useState('portion');  // 'portion' or 'total'
    const search = new URLSearchParams(window.location.search).get('search') || '';

    // Alternate calorie type to show in the CaloriesMeter component
    const alternateCaloriesMeterType = () => {
        if (caloriesType === 'total') {
            return 'portion';
        } else {
            return 'total';
        }
    }

    const caloriesMeterTitle = () => {
        if (caloriesType === 'total') {
            return 'Total calories';
        } else {
            return 'Calories per portion';
        }
    }

    useEffect(() => {
        // Función asíncrona dentro de useEffect
        const fetchData = async () => {
            try {
                const recipe = await getInformationRecipe(id);  // Llamada a la función asíncrona
                setData(recipe);  // Almacena los datos obtenidos en el estado
                setLoading(false); // Marca que ha terminado la carga
            } catch (err) {
                setError(err); // En caso de error, lo almacenamos
                setLoading(false);
            }
        };

        fetchData(); // Ejecutamos la función asíncrona
    }, []); // Array vacío para que solo se ejecute una vez al montar el componente

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return <Error message={error.message}/>;
    }

    const caloriePerPortion = Math.round(data.calories / data.portions);

    return (
        <>
            <RecipeHeader>{data.name}</RecipeHeader>

            <main className='main_content'>
                <Link to={`/?search=${search}`}>
                    <div className='text-gray-700 flex items-center gap-3 px-3 max-w-max mb-5 p-2 bg-gray-300 hover:bg-gray-700 hover:text-gray-200 transition rounded'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-house-door-fill" viewBox="0 0 16 16">
                            <path
                                d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
                        </svg>
                        Back to recipes
                    </div>
                </Link>

                <section className={'mt-10'}>
                    <SectionTitle className={'mb-2'}>General information</SectionTitle>

                    <ul className={'list-disc list-inside text-gray-900 space-y-1 text-lg'}>
                        <li><b>When to Eat:</b> {data.mealType}</li>
                        <li><b>Total calories:</b> {data.calories} kcal</li>
                        <li><b>Portions:</b> {data.portions}</li>
                        <li><b>Dish type:</b> {data.dishType}</li>
                        {data.cautions && <li><b>Cautions:</b> {data.cautions}</li>}
                    </ul>
                </section>

            <section className={'w-full flex flex-col mb-20 mt-14 justify-center'}>
                    <div className={'flex mb-6 gap-x-10 gap-y-2 items-start md:flex-row flex-col'}>
                        <SectionTitle className={'mb-0'}>{caloriesMeterTitle()}</SectionTitle>
                        <button onClick={() => setCaloriesType(alternateCaloriesMeterType())}
                            className={'bg-green-200 mt-1 hover:bg-green-300 text-green-700 font-bold py-2 px-4 rounded inline-flex items-center gap-2'}>
                            Change to {alternateCaloriesMeterType()} calories
                        </button>
                    </div>
                    <br/>
                    <CaloriesMeter calories={caloriesType === 'portion' ? caloriePerPortion : data.calories} type={caloriesType}/>
            </section>

            <section className='w-full grid sm:gap-2 gap-6'>
                    <SectionTitle>Ingredients</SectionTitle>
                    <div className='sm:grid p-5 pt-0 pl-8 flex flex-wrap gap-x-20 gap-y-6'
                         style={{gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))'}}>
                        {Object.entries(data.ingredients).map(([type, ingredients]) => (
                            <IngredientTypeGroup key={type} type={type} ingredients={ingredients}/>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Recipe;