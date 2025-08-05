const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="pt-20 md:pt-14 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
      {children}
    </div>
  );
};

export default ProtectedLayout;