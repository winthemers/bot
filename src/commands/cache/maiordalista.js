// Feito em ES5 (Navegadores antigos e NodeJS sem strict mode)
let lista = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
Math.min.apply(Math, lista)    // 16

// Feito em ES6 (Navegadores modernos e NodeJS padrão)
let lista = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
Math.max(...lista)    // 16