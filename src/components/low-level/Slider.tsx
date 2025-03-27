const Slider = ({
  name,
  onChange,
  value,
  labels,
}: {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  labels: string[];
}) => {
  return (
    <div className="relative mb-6">
      <input
        name={name}
        onChange={onChange}
        id="labels-range-input"
        type="range"
        value={value}
        min={"1"}
        max={labels.length}
        step={"1"}
        className="w-full h-2 rounded-lg appearance-auto  cursor-pointer dark:bg-gray-700 transition-all duration-200 ease-out"
      />
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
        1 min
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-1/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
        2 min
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-2/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
        3 min
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-3/4 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">
        4 min
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
        5 min
      </span>

      {labels.map((label: string, index: number) => {
        if (index === 0) {
          return (
            <span className="text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
              {label}
            </span>
          );
        } else if (index === label.length - 1) {
          <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
            {label}
          </span>;
        } else {
          <span
            className={`text-sm text-gray-500 dark:text-gray-400 absolute start-1/${index} -translate-x-1/2 rtl:translate-x-1/2 -bottom-6`}
          >
            {" "}
            2 min
          </span>;
        }
      })}
    </div>
  );
};

export default Slider;
