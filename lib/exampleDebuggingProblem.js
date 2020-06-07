/**
 * Library that demonstrates something throwing when its init() is called
 */


// Container for module
const example = {};

example.init = () => {
    // This is an error created intentionally (bar is not defined)
    const foo = bar;
};

module.exports = example;