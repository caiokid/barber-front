type ContentProps = {
  children: React.ReactNode;
  className?: string;
};

function Content({ children, className }: ContentProps) {
  return <div className={className}>{children}</div>;
}

export default Content;
