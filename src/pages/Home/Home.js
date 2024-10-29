// CSS
import styles from "./Home.module.css";

// hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useNavigate, Link } from "react-router-dom";

// react
import { useState } from "react";

// components
import BookDetail from "../../components/BookDetail";

const Home = () => {
  const { documents: books = [], loading } = useFetchDocuments("books"); // Garante que books seja um array
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };


  let a = []
  books.map((book) => {
    const alt = book.tags.replace(/#/g, '').split(',');
    a.push(...alt);

  })
  a = [...new Set(a)]


  return (

    <div className={styles.home}>

      <form className={styles.search_form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Procure aqui o livro"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-dark">Pesquisar</button>
      </form>
      <div className={styles.books_container}>
        {loading && <p>Carregando...</p>}
        {books && books.length === 0 && (
          <div className={styles.nobooks}>
            <p>Não foram encontrados livros</p>
            <Link to="/books/create" className="btn">
              Criar primeiro livro
            </Link>
          </div>

        )}
        <ul>
          {a.map((title, index) => {
            return (
              <li key={index}>
                <h2>{title}</h2>
                <div className={styles.books_list}>

                  {books
                    .filter((book) => book.tags.includes(title)) // Filtra livros que possuem a tag correspondente
                    .map((book) => (
                      <Link to={`/books/${book.id}`} className={styles.fit_content}>
                        <BookDetail key={book.id} book={book} />
                      </Link>
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
