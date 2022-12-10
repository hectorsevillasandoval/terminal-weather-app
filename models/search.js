require('dotenv').config();
require('colors');
const fs = require('node:fs');

class Search {
    history = [];
    MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
    WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
    dbPath = './db/database.json';

    constructor(){
        this.readDb();
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

    get capitalizeHistory(){
        //[ 'San Jose' ]
        return this.history.map( place => {
            let words = place.split(' ');
            words = words.map( p => p[0].toUpperCase() + p.substring(1) );
            return words.join(' ');
        });
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

    addToHistory( place = '' ){

        place = place.toLowerCase();
        
        if( this.history.includes( place ) ) return;

        this.history.unshift( place );

        this.saveDb();
        
        return;
    }

    saveDb() {
        const payload = {
            history: this.history
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );

        return true;
    }

    readDb() {
        if( !fs.existsSync( this.dbPath ) ) return;
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        if( !info ) return;
        const data = JSON.parse( info );

        this.history = data.history;
    }
}


module.exports = Search;