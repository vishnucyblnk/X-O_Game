import React, { useState } from 'react';
import './Display.css';
import { Form, Modal } from 'react-bootstrap';

function Display() {
    const [buttonCount, setButtonCount] = useState(0);
    const [matrix, setMatrix] = useState([]);
    const [playerScore,setPlayerScore] = useState(0);
    const [aiScore,setAiScore] = useState(0);
    const [isCount1Turn, setIsCount1Turn] = useState(true);
    const [buttonColors, setButtonColors] = useState({});
    const [show,setShow] = useState({});
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [countt,setCountt] = useState(0)
    const [click,setClick] = useState(0)

    // Function to toggle the input field's disabled state
    const toggleInput = () => {
        setIsInputDisabled(!isInputDisabled);
    };
    
    const toggleRefresh =()=>{
        window.location.reload();
    }

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value);
        setButtonCount(isNaN(value) ? 0 : value);
        generateMatrix(value)
        
    };

// generating Buttons-------------------------------------------------------------

                // const createButtons = () => {
                //     const buttons = [];
                //     for (let i = 1; i <= buttonCount; i++) {
                //         buttons.push(
                //             <div key={i}>
                //                 {
                //                 Array(i).fill(null).map((_,j) => (
                //                     <button key={j} type="button" className="rounded-circle m-2 fw-bold p-3 btn btn-primary" fdprocessedid="bo9s8q"> {j+1} </button>
                //                 )) 
                //                 }
                //             </div>)
                //     }
                //     return buttons;
                // };
        

    const createButtons = () => {
        const buttons = [];
        for (let i = 1; i <= buttonCount; i++) {
          for (let j = 0; j < i; j++) {
            const buttonId = `${i}-${j + 1}`;
            const buttonColor = buttonColors[buttonId] || 'danger';
            const buttonValue = show[buttonId] || '-';
            buttons.push(
                <button id={`${i}-${j + 1}`} value={false} key={j} type="button" className={`btn btn-${buttonColor} shadow rounded-circle m-2 fw-bold p-3`} fdprocessedid="ya1lpr" onClick={(e)=>{handleClick(e)}} disabled={buttonColors[buttonId] === 'disabled'}> {buttonValue} </button>
            );
          }
          buttons.push(<br key={`br-${i}`} />);
        }
        return buttons;
      };

// generating matrix for adding value for each buttons ---------------------------------

    const generateMatrix = (value) => {
        const newMatrix = [];
        for (let i = 0; i < value; i++) {
            const row = [];
            for (let j = 0; j < i+1 ; j++) {
            row[j] = false;
            }
            newMatrix.push(row);
        }
        setMatrix(newMatrix);
        console.log(matrix);
    };

// handling each button click ----------------------------------------------------------

    const handleClick = (e)=>{
        if(buttonCount>1 && buttonCount < 14){
            const oneSize = [].concat(...matrix).length;
            setCountt(oneSize)
            setClick((click)=>click+1)

            const {id} = e.target

            const buttonId = e.target.id;
            if (buttonColors[buttonId] === 'disabled') {
                return;
            }
            // Disable the clicked button
            const updatedButtonColors = { ...buttonColors };
            updatedButtonColors[buttonId] = 'disabled';
            setButtonColors(updatedButtonColors);
            if (isCount1Turn) {
                setShow({ ...show, [buttonId]: 'x' })
            } 
            else {
                setShow({ ...show, [buttonId]: 'o' })
            }
            
            // console.log(value);
            // console.log(id);
            const ext = id.split('-')
            const rowId = ext[0]-1
            const colId = ext[1]-1
            // console.log(rowId,colId);
            // console.log(matrix);
            const tempMatrix = [...matrix]
            tempMatrix[rowId][colId] = true;
            setMatrix(tempMatrix)
            // console.log(matrix);
            checkStatus(rowId,colId)
            }else{
                alert('please input value between 2 to 13 ')
                toggleRefresh()
            }
        
    }

// checking status of each button

    const checkStatus = (rowId,colId)=>{
        let tempScore;
        if (isCount1Turn) {
            tempScore = playerScore
        } 
        else {
            tempScore = aiScore
        }
        // -----transposing matrix -----------
        // Find the maximum length among subarrays
        const maxLength = Math.max(...matrix.map(arr => arr.length));
        // Initialize the transposed array
        const transposedArray = Array.from({ length: maxLength }, () => []);
        // Transpose the original array
        for (let i = 0; i < maxLength; i++) {
            for (let j = 0; j < matrix.length; j++) {
                if (matrix[j][i] !== undefined) {
                transposedArray[i].push(matrix[j][i]);
                }
            }
        }

        let checker = arr => arr.every(v => v === true);
        const tempRowMatrix = [...matrix]
        const tempColMatrix = [...transposedArray]

        const rowCheck = checker(tempRowMatrix[rowId])
        const colCheck = checker(tempColMatrix[colId])
        // console.log(rowCheck,colCheck);

        
        // Player Score Counting--------------------------------------------------
        
        if(rowCheck === true){
            console.log('hai row');
            console.log(tempRowMatrix[rowId].length);
            tempScore += tempRowMatrix[rowId].length
        }
        else if(colCheck === true){
           console.log('hai col')
           console.log(tempColMatrix[colId].length);
           tempScore += tempColMatrix[colId].length
        }

        // setPlayerScore(tempScore)
        // console.log(`playerScore = ${playerScore}`);

        const handleIncrement = () => {
            if (isCount1Turn) {
            setPlayerScore(tempScore)
            } 
            else {
            setAiScore(tempScore)
            }
            setIsCount1Turn(!isCount1Turn);
        };
        handleIncrement()


        
    }


    return (
        <> 
            <div className='row' style={{maxHeight:'110vh'}}>
                <div className="col-lg-4 d-flex flex-column p-5">
                    <div className='d-flex flex-column align-items-center'>
                        <h1 className='mb-5 text-center text-warning fw-bold'>X-O GAME</h1>
                        <h5 className='mt-2 mb-3 text-center'>Enter the size of Game (1 to 13)</h5>
                        <div className='d-flex justify-content-center mb-5 '>
                            <Form.Control type="number" value={buttonCount} min="2" max="13" onChange={(e)=>handleInputChange(e)}  disabled={isInputDisabled} />
                
                            <button type="button" className="btn btn-primary" fdprocessedid="bo9s8q" onClick={toggleRefresh} >NEW GAME</button>
                        </div>
                    </div>
                    <div className="p-3 scoreCard border border-secondary rounded">
                        <h4 className='mt-2 text-center text-info'>SCORE CARD</h4>
                        <div className='d-flex flex-column justify-content-evenly align-items-center'>
                        
                        <h5><span className='text-secondary'>(X)</span> PLAYER 1 : {playerScore}</h5>
                        <h5><span className='text-secondary'>(O)</span> PLAYER 2 : {aiScore}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8 mt-4 p-5">
                    <div className="d-flex flex-column justify-content-evenly align-items-center">
                        {(countt === click && countt !== 0 && click !== 0) && (
                            <div class="card mb-5 bg-success text-center">
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


export default Display 