const Selector = () => {
    return ( <>    
    <div className="w-full flex flex-row p-1 bg-white bg-opacity-5 text-xs rounded-md justify-evenly">
        <div className="w-full flex justify-center items-center p-1 px-5 rounded cursor-pointer hover:bg-white hover:text-black transition-all transform-150">
            <span>7 min</span>
        </div>
        <div className="w-full flex justify-center items-center p-1 px-5 rounded cursor-pointer hover:bg-white hover:text-black transition-all transform-150">
            <span>10 min</span>
        </div>
        <div className="w-full flex justify-center items-center p-1 px-5 rounded cursor-pointer hover:bg-white hover:text-black transition-all transform-150">
            <span>12 min</span>
        </div>
        <div className="hidden w-full lg:flex justify-center items-center p-1 px-5 rounded cursor-pointer hover:bg-white hover:text-black transition-all transform-150">
            <span>15 min</span>
        </div>
    </div>
    </> );
}
 
export default Selector;