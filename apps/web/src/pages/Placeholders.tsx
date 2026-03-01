


export const Placeholder = ({ title }: { title: string }) => {
    return (
        <div className="p-4 max-w-md mx-auto min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold dark:text-white">{title}</h1>
        </div>
    );
};
