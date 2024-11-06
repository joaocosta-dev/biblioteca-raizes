import styles from './Search.module.css';

// hooks
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useQuery } from '../../hooks/useQuery';

// components
import { Link } from 'react-router-dom';
import BookDetail from '../../components/BookDetail';

const Search = () => {
  const query = useQuery();
  const search = query.get('q');

  const { documents: books } = useFetchDocuments('books', search);

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
        {books &&
          (books.filter((book) => book.title.includes(search)).length > 0 ? (
            books
              .filter((book) => book.title.toLowerCase().includes(search))
              .map((book) => <BookDetail key={book.id} book={book} />)
          ) : (
            <p>Nenhum item encontrado</p>
          ))}
      </div>
    </div>
  );
};

export default Search;
