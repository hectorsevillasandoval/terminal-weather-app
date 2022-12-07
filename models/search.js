require('dotenv').config();
require('colors');

class Search {
    history = [ 'Miami', 'Guatemala', 'Managua', 'Cartago' ];
    MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

    constructor(){
        // TODO: read DB if exists
    }

    get mapboxParams(){
        return {
            'access_token': process.env.MAPBOX_TOKEN,
            'limit': 5,
            'language': 'en',
        };
    }

    get weatherParams(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            units: 'metric'
        };
    }

    /**
     * List Cities from Mapbox API
     * @param {*} place 
     * @returns list of matched places
     */

    async city( place = '' ) {
        try{
            const places = await fetch(`${this.MAPBOX_API_URL}/${place}.json?${new URLSearchParams( this.mapboxParams )}`);
            const { features } = await places.json();
            
            return features.map( place => ({
                id: place.id,
                place_name: place.place_name,
                lng: place.center[0],
                lat: place.center[1],
            }) );

        } catch( error ){
            console.error( 'Place not found'.red );
            return [];
        }
    }

    async weather( lon, lat ){
        try{

            const weather = await fetch(`${this.WEATHER_API_URL}?${new URLSearchParams({
                ...this.weatherParams,
                lat,
                lon,
            })}`);

            const weatherResponse = await weather.json();

            return weatherResponse;

        } catch(error){
            console.error( 'Error, something happened'.red );
            return [];
        }
    }
}


module.exports = Search;