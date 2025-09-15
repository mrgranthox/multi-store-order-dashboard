// Jest setup file for TextEncoder/TextDecoder polyfills
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
