// Need to use import() syntax to conditionally import globals

// If in a Node environment
if(typeof process !== 'undefined' && process.release.name === 'node') {
    // Group Node modules into a global Node object and configure the Node environment
    await import('@framework/globals/node/Node.js');
    
    // Add functionality to existing Node classes
    await import('@framework/globals/node/Buffer.js');
    await import('@framework/globals/node/Stream.js');

    // Add the Terminal global
    await import('@framework/globals/node/Terminal.js');
}

// Add functionality to standard JavaScript classes
await import('@framework/globals/standard/Array.js');
await import('@framework/globals/standard/Boolean.js');
await import('@framework/globals/standard/errors/Error.js');
await import('@framework/globals/standard/Function.js');
await import('@framework/globals/standard/Number.js');
await import('@framework/globals/standard/Object.js');
await import('@framework/globals/standard/Promise.js');
await import('@framework/globals/standard/RegularExpression.js');
await import('@framework/globals/standard/String.js');

// Create Framework custom global classes
await import('@framework/globals/custom/Class.js');
await import('@framework/globals/custom/Json.js');
await import('@framework/globals/custom/Primitive.js');
await import('@framework/globals/custom/Time.js');
