const BtnFull = ({text}:{text:string}) => {
    return ( 
            <button className="bg-spiral-blue text-xs text-white px-3 py-2 rounded-full outline-none w-full">
            {text}
          </button>
     );
}
 
export default BtnFull;