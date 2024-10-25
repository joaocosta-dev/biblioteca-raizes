// hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useRouter } from "next/navigation";

// react
import { useState } from "react";

//style
import styles from "../../styles/home.css"

// components
import BookDetail from "@/ui/bookdetail";

const Home = () => {
    const { documents: books = [], loading } = useFetchDocuments("books"); // Garante que books seja um array
    // const navigate = useRouter();
    // const [query, setQuery] = useState("");

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (query) {
    //         return navigate(`/search?q=${query}`);
    //     }
    // };


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
                                            <button key={indexbook} href={`/books/${book.id}`} className="fit-content">
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
