import React, { useState } from 'react';
import './Display.css';
import { Form } from 'react-bootstrap';

function Display() {
    const [buttonCount, setButtonCount] = useState(0);
    const [matrix, setMatrix] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [isCount1Turn, setIsCount1Turn] = useState(true);
    const [buttonColors, setButtonColors] = useState({});
    const [show, setShow] = useState({});
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [countt, setCountt] = useState(0);
    const [click, setClick] = useState(0);

    const toggleRefresh = () => {
        window.location.reload();
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value);
        setButtonCount(isNaN(value) ? 0 : value);
        generateMatrix(value);
    };

    const createButtons = () => {
        const buttons = [];
        for (let i = 1; i <= buttonCount; i++) {
            for (let j = 0; j < i; j++) {
                const buttonId = `${i}-${j + 1}`;
                const buttonColor = buttonColors[buttonId] || 'danger';
                const buttonValue = show[buttonId] || '-';
                buttons.push(
                    <button
                        id={`${i}-${j + 1}`}
                        key={j}
                        type="button"
                        className={`btn btn-${buttonColor} m-2 fw-bold p-3 text-white`}
                        onClick={(e) => handleClick(e)}
                        disabled={buttonColors[buttonId] === 'disabled'}
                    >
                        {buttonValue}
                    </button>
                );
            }
            buttons.push(<br key={`br-${i}`} />);
        }
        return buttons;
    };

    const generateMatrix = (value) => {
        const newMatrix = [];
        for (let i = 0; i < value; i++) {
            const row = [];
            for (let j = 0; j < i + 1; j++) {
                row[j] = false;
            }
            newMatrix.push(row);
        }
        setMatrix(newMatrix);
    };

    const handleClick = (e) => {
        if (buttonCount > 1 && buttonCount < 14) {
            const oneSize = [].concat(...matrix).length;
            setCountt(oneSize);
            setClick((click) => click + 1);

            const { id } = e.target;

            const buttonId = e.target.id;
            if (buttonColors[buttonId] === 'disabled') {
                return;
            }

            // Disable the clicked button
            const updatedButtonColors = { ...buttonColors };
            updatedButtonColors[buttonId] = 'disabled';
            setButtonColors(updatedButtonColors);

            // Set 'X' or 'O' based on the current player's turn
            setShow({ ...show, [buttonId]: isCount1Turn ? 'x' : 'o' });

            // Identify row and column
            const ext = id.split('-');
            const rowId = parseInt(ext[0]) - 1;
            const colId = parseInt(ext[1]) - 1;

            // Update matrix with the click
            const tempMatrix = [...matrix];
            tempMatrix[rowId][colId] = true;
            setMatrix(tempMatrix);

            checkStatus(rowId, colId);
        } else {
            alert('Please input a value between 2 and 13.');
            toggleRefresh();
        }
    };
    const checkStatus = (rowId, colId) => {
        // Determine the current player's score
        let tempPlayerScore = isCount1Turn ? playerScore : aiScore;
        let tempOtherScore = isCount1Turn ? aiScore : playerScore;
    
        // Transpose matrix to check columns
        const maxLength = Math.max(...matrix.map((arr) => arr.length));
        const transposedArray = Array.from({ length: maxLength }, () => []);
        for (let i = 0; i < maxLength; i++) {
            for (let j = 0; j < matrix.length; j++) {
                if (matrix[j][i] !== undefined) {
                    transposedArray[i].push(matrix[j][i]);
                }
            }
        }
    
        const checker = (arr) => arr.every((v) => v === true);
        const rowComplete = checker(matrix[rowId]);
        const colComplete = checker(transposedArray[colId]);
    
        // Calculate scores for row and column completions
        const rowScore = rowComplete ? matrix[rowId].length : 0;
        const colScore = colComplete ? transposedArray[colId].length : 0;
    
        // Determine the best and least scores
        const bestScore = Math.max(rowScore, colScore);
        const leastScore = Math.min(rowScore, colScore);
    
        // Update scores based on the best and least scores
        if (rowComplete || colComplete) {
            if (rowScore >= colScore) {
                tempPlayerScore += rowScore;
            } else {
                tempPlayerScore += colScore;
            }
            tempOtherScore += leastScore;
        }
    
        // Update the scores in state
        if (isCount1Turn) {
            setPlayerScore(tempPlayerScore);
            setAiScore(tempOtherScore);
        } else {
            setAiScore(tempPlayerScore);
            setPlayerScore(tempOtherScore);
        }

    
        // Switch the turn
        setIsCount1Turn(!isCount1Turn);
    };

    return (
        <>
            <div className='row' style={{ maxHeight: '110vh' }}>
                <div className="col-lg-4 d-flex flex-column p-5">
                    <div className='d-flex flex-column align-items-center'>
                        <h1 className='mb-5 text-center text-warning fw-bold'>X-O GAME</h1>
                        <h5 className='mt-2 mb-3 text-center'>Enter the size of the Game (2 to 13)</h5>
                        <div className='d-flex justify-content-center mb-5'>
                            <Form.Control type="number" value={buttonCount} min="2" max="13" onChange={(e) => handleInputChange(e)} disabled={isInputDisabled} />
                            <button type="button" className="btn btn-primary" onClick={toggleRefresh}>NEW GAME</button>
                        </div>
                    </div>
                    <div className="p-3 scoreCard border border-secondary rounded">
                        <h4 className='mt-2 text-center text-info'>SCORE CARD</h4>
                        <div className='d-flex flex-column justify-content-evenly align-items-center'>
                            <h5><span className='text-secondary'>(X)</span> PLAYER 1: {playerScore}</h5>
                            <h5><span className='text-secondary'>(O)</span> PLAYER 2: {aiScore}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8 mt-4 p-5">
                    <div className="d-flex flex-column justify-content-evenly align-items-center">
                        {(countt === click && countt !== 0 && click !== 0) && (
                            <div className="card mb-5 bg-success text-center">
                                <h2 className='text-secondary-emphasis fw-bold fs-1'>
                                    {playerScore > aiScore ? 'PLAYER 1 WON' : aiScore > playerScore ? 'PLAYER 2 WON' : 'TIE'}
                                </h2>
                            </div>
                        )}
                        <div className="button-container">{createButtons()}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Display;
