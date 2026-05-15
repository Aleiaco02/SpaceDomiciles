const arr = [1, 3, -2, -1, 6, 7, 8, -5, -6, 2, 1, 3, -2];

function contaOccorrenze(array, num) {
    let count = 0;

    // 9 * (-1) => -9

    for (let i = 0; i < array.length; i++) {
        if (Math.abs(array[i]) === num) {
            count++
        }
    }

    return count;
}

// Il numero delle occorrenze del numero "num" passato come parametro, senza considerare il segno
console.log(contaOccorrenze(arr, 1)); // 3