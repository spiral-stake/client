const Overlay = ({ overlay }: { overlay: React.ReactNode | undefined }) => {
  return (
    overlay && (
      <section className="fixed top-0 left-0 z-50 bg-neutral-700 bg-opacity-50 flex justify-center items-center w-[100vw] h-[100vh]">
        {overlay}
      </section>
    )
  );
};

export default Overlay;
