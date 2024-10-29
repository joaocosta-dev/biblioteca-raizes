// hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useRouter } from "next/navigation";

// react
import { useState,useEffect } from "react";

//style
import styles from "../../styles/home.css"

// components
import BookDetail from "@/ui/bookdetail";



const Home = () => {
    const { documents: books = [], loading } = useFetchDocuments("books"); // Garante que books seja um array
    const navigate = useRouter();
    // const [query, setQuery] = useState("");

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (query) {
    //         return navigate(`/search?q=${query}`);
    //     }
    // };

    useEffect(() => {
        let startY = 0;
    
        const handleTouchStart = (event) => {
          startY = event.touches[0].clientY; // Captura a posição inicial do toque
        };
    
        const handleTouchMove = (event) => {
          event.preventDefault(); // Impede a rolagem padrão
          const currentY = event.touches[0].clientY; // Posição atual do toque
          window.scrollBy(0, startY - currentY); // Rolagem personalizada
          startY = currentY; // Atualiza a posição inicial
        };
    
        // Verifica se a largura da tela é menor ou igual a 768
        if (window.innerWidth <= 768) {
          document.body.addEventListener('touchstart', handleTouchStart, { passive: false });
          document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
        }
    
        // Limpeza dos eventos ao desmontar o componente
        return () => {
          document.body.removeEventListener('touchstart', handleTouchStart);
          document.body.removeEventListener('touchmove', handleTouchMove);
        };
      }, []);

    
    function navigateTo(param) {
        navigate.push(param)
    }

    let a = []
    books.map((book) => {
        const alt = book.tags.replace(/#/g, '').split(',');
        a.push(...alt);

    })
    a = [...new Set(a)]


    return (

        <div className="home">
            {/* <form className="" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Procure aqui o livro"
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-dark">Pesquisar</button>
            </form> */}
            <div className="books-container">
                {loading && <p>Carregando...</p>}
                {books && books.length === 0 && (
                    <div className="noboks">
                        <p>Não foram encontrados livros</p>
                        <button href="/books/create" className="btn">
                            Criar primeiro livro
                        </button>
                    </div>

                )}
                <ul>
                    {a.map((title, index) => {
                        return (
                            <li key={index}>
                                <h2>{title}</h2>
                                <div className="books-list">

                                    {books
                                        .filter((book) => book.tags.includes(title)) // Filtra livros que possuem a tag correspondente
                                        .map((book, indexbook) => (
                                            <button key={indexbook} onClick={()=>{navigateTo(`/book/${book.id}`)}} className="fit-content">
                                                <BookDetail book={book} />
                                            </button>
                                        ))}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );

};


export default Home;
