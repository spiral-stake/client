import Skeleton from "react-loading-skeleton";

const TextLoading = ({ width, lineCount }: { width?: number; lineCount?: number }) => {
  // Needs to work
  return <Skeleton highlightColor="#01152a" baseColor="#03050d" width={width} count={lineCount} />;
};

export default TextLoading;
