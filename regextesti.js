const numero = "09-11231"
const tarkistus = value => {
    if (value.length >= 8) {
        return /\d{2,3}-\d+/.test(value)
    }
return false
}
console.log(tarkistus(numero))