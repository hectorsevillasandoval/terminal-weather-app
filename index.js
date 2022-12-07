const { readInput, inquirerMenu, pause, listPlaces } = require('./helpers/inquirer');
const Search = require('./models/search');

const app = async () => {
    let option;

    do{
       const search = new Search();
        option = await inquirerMenu();

        switch( option ){
            case 1:
                // Show Message
                const searchTerm = await readInput('City: ');
                
                const places = await search.city( searchTerm );
                
                const placeId = await listPlaces( places );

                const { id, place_name: placeName, lng, lat } = places.find( place => place.id === placeId );

                const weather = await search.weather( lng, lat );

                console.log(`
                    ${'-'.repeat(100)}
                        ${'RESULTS'.cyan}
                    ${'-'.repeat(100)}
                    City: ${placeName}
                    Lat: ${lat}
                    Lng: ${lng}
                    Temperature: ${ Math.ceil(weather.main.temp) }
                    Min: ${ weather.main.temp_min }
                    Max: ${ weather.main.temp_max }
                    Humidity: ${ weather.main.humidity }
                    Weather Descriptions: ${ weather.weather[0].description }
                    ${'-'.repeat(100)}
                `);
                
                break;
            case 2:
                console.log('Opcion 2');
                break;
            case 0:
                console.log('Opcion 0');
                break;
        }

        option !== 0 && await pause();

    } while( option !== 0 );
};

app();