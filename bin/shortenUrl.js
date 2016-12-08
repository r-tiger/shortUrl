const _alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const _base = _alphabet.length;

/**
 *
 * @param num {number}
 * @returns {string}
 */
exports.encodeUrl = function(num) {
    let str = '';
    while (num > 0) {
        str = _alphabet.charAt(num % _base) + str;
        num = Math.floor(num / _base);
    }
    return str;
};

/**
 *
 * @param str {string}
 * @returns {number}
 */
exports.decodeUrl = function(str) {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        num = num * _base + _alphabet.indexOf(str.charAt(i));
    }
    return num;
};