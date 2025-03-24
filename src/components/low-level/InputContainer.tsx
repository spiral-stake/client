//structure

//label symbol - lebel      input criteria
//input 
//error msg

// need css

const InputContainer = ({ inputComponent, label, labelSymbol, condition, errorMsg }: { inputComponent: JSX.Element, label?: string, labelSymbol?: string, condition?: string, errorMsg?: string }) => {
    return (
        <div>
            {inputComponent}
        </div>
    );
}

export default InputContainer;