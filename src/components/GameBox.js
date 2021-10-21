import Sketch from 'react-p5'

export default function GameBox() {
    const N = 8;
    const RANDOM_INITIAL_RANGE = 100;
    const MATRIX_LENGTH = Math.pow(2, N) + 1;

    const heightMatrix = diamondSquare(generateMatrix())
    console.log(heightMatrix)
    let matrixUnit = 1;

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef)
    }

    const draw = p5 => {
        p5.background(220, 220, 220)
        let x = 0;
        let y = 0;
        for (let line of heightMatrix) {
            for (let heightValue of line) {
                p5.noStroke()
                p5.fill(assignColor(heightValue))
                p5.square(x, y, matrixUnit)
                x += matrixUnit;
            }
            y += matrixUnit
            x = 0;
        }
    }

    function assignColor(heightValue) {
        if (heightValue > 130) return 'white'
        if (heightValue > 110) return 'saddlebrown'
        if (heightValue > 90) return 'peru'
        if (heightValue > 70) return 'burlywood'
        if (heightValue > 40) return 'beige'
        if (heightValue > 20) return 'lightgreen'
        if (heightValue > 0) return 'lightyellow'
        if (heightValue > -10) return 'aliceblue'
        if (heightValue > -30) return 'cyan'
        if (heightValue > -50) return 'darkcyan'
        if (heightValue > -70) return 'darkblue'
        return 'black'
    }

    function randomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function generateMatrix() {
        const matrix = new Array(MATRIX_LENGTH)
            .fill(0)
            .map(() => new Array(MATRIX_LENGTH).fill(null));

        matrix[0][MATRIX_LENGTH - 1] = randomInRange(0, RANDOM_INITIAL_RANGE);
        matrix[MATRIX_LENGTH - 1][0] = randomInRange(0, RANDOM_INITIAL_RANGE);
        matrix[0][0] = randomInRange(0, RANDOM_INITIAL_RANGE);
        matrix[MATRIX_LENGTH - 1][MATRIX_LENGTH - 1] = randomInRange(
            0,
            RANDOM_INITIAL_RANGE
        );

        return matrix;
    }

    function diamondSquare(matrix) {
        let chunkSize = MATRIX_LENGTH - 1;
        let randomFactor = RANDOM_INITIAL_RANGE;

        while (chunkSize > 1) {
            calculateSquare(matrix, chunkSize, randomFactor)

            calculateDiamond(matrix, chunkSize, randomFactor)

            chunkSize /= 2;
            randomFactor /= 2;
        }

        return matrix;
    }

    function calculateDiamond(matrix, chunkSize, randomFactor) {
        let sumComponents = 0;
        let sum = 0;
        for (let i = 0; i < matrix.length - 1; i += chunkSize) {
            for (let j = 0; j < matrix.length - 1; j += chunkSize) {
                const BOTTOM_RIGHT = matrix[j + chunkSize]
                    ? matrix[j + chunkSize][i + chunkSize]
                    : null;
                const BOTTOM_LEFT = matrix[j + chunkSize]
                    ? matrix[j + chunkSize][i]
                    : null;
                const TOP_LEFT = matrix[j][i];
                const TOP_RIGHT = matrix[j][i + chunkSize];
                const { count, sum } = [
                    BOTTOM_RIGHT,
                    BOTTOM_LEFT,
                    TOP_LEFT,
                    TOP_RIGHT
                ].reduce(
                    (result, value) => {
                        if (isFinite(value) && value != null) {
                            result.sum += value;
                            result.count += 1;
                        }
                        return result;
                    },
                    { sum: 0, count: 0 }
                );
                const changed = { row: j + chunkSize / 2, column: i + chunkSize / 2 };
                matrix[changed.row][changed.column] =
                    Math.floor(sum / count + randomInRange(-randomFactor, randomFactor));
            }
        }
        return matrix;
    }

    function calculateSquare(matrix, chunkSize, randomFactor) {
        const half = chunkSize / 2;
        for (let y = 0; y < matrix.length; y += half) {
            for (let x = (y + half) % chunkSize; x < matrix.length; x += chunkSize) {
                const BOTTOM = matrix[y + half] ? matrix[y + half][x] : null;
                const LEFT = matrix[y][x - half];
                const TOP = matrix[y - half] ? matrix[y - half][x] : null;
                const RIGHT = matrix[y][x + half];
                const { count, sum } = [BOTTOM, LEFT, TOP, RIGHT].reduce(
                    (result, value) => {
                        if (isFinite(value) && value != null) {
                            result.sum += value;
                            result.count += 1;
                        }
                        return result;
                    },
                    { sum: 0, count: 0 }
                );
                matrix[y][x] = Math.floor(sum / count + randomInRange(-randomFactor, randomFactor));
            }
        }
        return matrix;
    }

    return <Sketch setup={setup} draw={draw} />
}

