const BtnFull = ({ text, onClick, disabled }: { text: string, onClick: () => void, disabled: boolean }) => {
     return (
          <button disabled={disabled} onClick={onClick} className="bg-spiral-blue text-xs text-white px-3 py-2 rounded-full outline-none w-full">
               {text}
          </button>
     );
}

export default BtnFull;