import styles from "./Search.module.css";

// hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";

// components
import { Link } from "react-router-dom";
import BookDetail from "../../components/BookDetail";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  const { documents: books } = useFetchDocuments("books", search);

  return (
    <div className={styles.search_container}>
      <h1>Resultados encontrados para: {search}</h1>
      <div className="post-list">
        {books && books.length === 0 && (
          <>
            <p>Não foram encontrados livros a partir da sua busca...</p>
            <Link to="/" className="btn btn-dark">
              Voltar
            </Link>
          </>
        )}
        {books && books.map((book) => <BookDetail key={book.id} post={book} />)}
      </div>
    </div>
  );
};

export default Search;
