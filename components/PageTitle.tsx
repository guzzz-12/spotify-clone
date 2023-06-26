interface Props {
  title: string;
};

const PageTitle = ({title}: Props) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">
        {title}
      </h2>
    </div>
  )
};

export default PageTitle;