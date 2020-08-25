// Execute the app's script
(await import('child_process')).spawn(
    'node',
    [
        '--no-warnings', // Do not show warnings
        '--experimental-loader', // Use a module loader
        './../globals/node/ModuleLoader.js',
        'FrameworkApp.js', // The app
    ].concat(process.argv.slice(2)), // Pass arguments to the process
    {
        stdio: 'inherit', // Inherit standard input, output, and error
    },
);
