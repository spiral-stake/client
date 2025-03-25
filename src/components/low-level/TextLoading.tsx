import Skeleton from "react-loading-skeleton";

const TextLoading = ({ width }: { width?: number }) => {
  // Needs to work
  return <Skeleton highlightColor="#01152a" baseColor="#03050d" width={width} />;
};

export default TextLoading;
