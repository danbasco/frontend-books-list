const Loader : React.FC = () => {
    return  (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            role="status"
            aria-live="polite"
        >
            <span className="loader" aria-hidden="true" />
            <span className="sr-only">Carregando...</span>
        </div>
    );
}

export default Loader;