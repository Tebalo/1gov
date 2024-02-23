interface PageTitleProps{
    Title: string
}
export const PageTitle: React.FC<PageTitleProps> = ({Title}) => {
    return (
        <h4 className="text-2xl font-bold">{Title}</h4>
    );
}