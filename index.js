require( 'colors' );
const { readInput, inquirerMenu, pause, listPlaces } = require('./helpers/inquirer');
const Search = require('./models/search');

const app = async () => {
    let option;
    const search = new Search();

    do{
        option = await inquirerMenu();

        switch( option ){
            case 1:
                // Show Message
                const searchTerm = await readInput('City: ');
                
                const places = await search.city( searchTerm );
                
                const placeId = await listPlaces( places );

                if( placeId === 0 ) continue;

                const { id, place_name: placeName, lng, lat } = places.find( place => place.id === placeId );

                search.addToHistory( placeName );

                const weather = await search.weather( lng, lat );

                console.log(`

                    ${'*'.cyan.repeat(50)}
                    
                    ${'RESULTS'.cyan}
                    
                    ${'*'.cyan.repeat(50)}

                    City: ${placeName}
                    Lat: ${lat}
                    Lng: ${lng}
                    Temperature: ${ Math.ceil(weather.main.temp) }
                    Min: ${ weather.main.temp_min }
                    Max: ${ weather.main.temp_max }
                    Humidity: ${ weather.main.humidity }
                    Weather Descriptions: ${ weather.weather[0].description }
                    
                    ${'*'.repeat(50)}

                `);
                
                break;
            case 2:
                let index = 1;
                for( const place of search.capitalizeHistory ){
                    const idx = `${index++}.`.green;
                    console.log(`${ idx } ${ place }` );
                }
                console.log();
                break;
            case 0:
                break;
        }

        option !== 0 && await pause();

    } while( option !== 0 );
};

app();