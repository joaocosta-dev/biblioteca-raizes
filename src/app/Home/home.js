
// hooks
import BookDetail from "@/ui/bookdetail";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import {  useRouter } from "next/navigation";

// react
import { useState } from "react";

// components
// import BookDetail from "../../components/BookDetail";

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

        <div className="">

            {/* <form className="" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Procure aqui o livro"
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-dark">Pesquisar</button>
            </form> */}
            <div className="">
                {loading && <p>Carregando...</p>}
                {books && books.length === 0 && (
                    <div className="">
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
                                <div className="">

                                    {books
                                        .filter((book) => book.tags.includes(title)) // Filtra livros que possuem a tag correspondente
                                        .map((book) => (
                                            <button href={`/books/${book.id}`} className="">
                                                <BookDetail key={index} book={book} />
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
