const Slider = ({ name, onChange, value }: { name: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, value: string }) => {
    return (
        <div className="relative mb-6">
            <input name={name} onChange={onChange} id="labels-range-input" type="range" value={value} min="1" max="5" step={1} className="w-full h-2 rounded-lg appearance-auto  cursor-pointer dark:bg-gray-700 transition-all duration-300 ease-out" />
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">1 min</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">2 min</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">3 min</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-3/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">4 min</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">5 min</span>
        </div>


    );

}


export default Slider;