const inquirer = require('inquirer');
require('colors');

const { menu } = require('./menuOptions.js');


const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿What would you like to do?',
        choices: menu.map( choice => { 
            return { ...choice, name: `${choice.value.toString().yellow}. ${choice.name}` }
         } ),
    }
];

const inquirerMenu = async () => {
    console.clear();
    console.log('*'.repeat(100).green);
    console.log(`

    
██╗    ██╗███████╗ █████╗ ████████╗██╗  ██╗███████╗██████╗      █████╗ ██████╗ ██████╗ 
██║    ██║██╔════╝██╔══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗    ██╔══██╗██╔══██╗██╔══██╗
██║ █╗ ██║█████╗  ███████║   ██║   ███████║█████╗  ██████╔╝    ███████║██████╔╝██████╔╝
██║███╗██║██╔══╝  ██╔══██║   ██║   ██╔══██║██╔══╝  ██╔══██╗    ██╔══██║██╔═══╝ ██╔═══╝ 
╚███╔███╔╝███████╗██║  ██║   ██║   ██║  ██║███████╗██║  ██║    ██║  ██║██║     ██║     
 ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝     ╚═╝     
                                                                                       

   `.green);
    console.log('*'.repeat(100).green);
    console.log('\n');

    const { option } = await inquirer.prompt(questions);

    console.log('\n');

    return option;
};

const pause = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${'ENTER'.green} to continue...\n`,
        }
    ];
    await inquirer.prompt( question );
};

const readInput = async ( message ) => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate( value ) {
                if( value.length === 0 ) {
                    return 'Please enter a description';
                }
                return true;
            }
        }
    ];

    const { description } = await inquirer.prompt(question);

    return description;
}

const listPlaces = async ( places = [] ) => {
    const choices = places.map( (place, index) => {
        return {
            value: place.id,
            name: `${(index + 1).toString().green}. ${place.place_name}`
        };        
    });

    choices.unshift({
        value: 0,
        name: `${'0.'.green} Cancel`
    });

    if( choices.length > 0 ) { 
        const { foundPlaces } = await inquirer.prompt([
            {
                type: 'list',
                name: 'foundPlaces',
                message: 'Please Select a Place',
                choices
            },
        ]);
        

        return foundPlaces;
    }

    return false;
    
};

const listPendingTasks = async ( tasks = [] ) => {
    const choices = tasks.map( (task, index) => {
        return {
            value: task.id,
            checked: task.completed,
            name: `${(index + 1).toString().red}. ${task.description}`
        };        
    });

    if( choices.length > 0 ) { 
        const { pendingTasks } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'pendingTasks',
                choices
            },
        ]);
        

        return pendingTasks;
    }

    return false;
};

const confirm = async () => {
    
    const { deleteId } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'deleteId',
            message: '¿Are you sure?',
        }
    ]);

    return deleteId;

};

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    listPendingTasks
};