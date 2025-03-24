const PageTitle = ({ title, subheading }: { title: string, subheading: string }) => {
    return (
        <div className="w-full py-10">
            <div className="justify-start text-gray-200 text-3xl font-medium font-['Outfit']">{title}</div>
            <div className="justify-start text-xs mt-2 text-stone-300 font-[Outfit] font-light leading-normal">{subheading}</div>
        </div>
    );
}

export default PageTitle;