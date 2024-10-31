import styles from "./Dashboard.module.css";

import { Link } from "react-router-dom";

import { useAuthValue } from "../../contexts/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

const Dashboard = () => {
  const { user } = useAuthValue();

  // Busca os usuários
  const { document: userspecific } = useFetchDocument("users", user?.uid);
  // const readedBooks = userspecific.readedBooks;
  const readedBooks = userspecific?.readedBooks || []
  
  // Busca todos os livros
  const { documents: books } = useFetchDocuments("books");
  const { documents: rentals } = useFetchDocuments("rental");


  // Filtra os livros lidos
  const readedBooksfilter = books?.filter((book) => readedBooks.includes(book.id));

  const { deleteDocument } = useDeleteDocument("books");
  
  return (
    user && userspecific?.isAdmin !== true ? (

      <>
        < div className={styles.dashboard} >
          <h2>Área do leitor</h2>
          <p>Acompanhe suas solicitações e leituras realizadas</p>
          <h3 className="text-3xl underline">Aguardando aprovação</h3>
          {
            readedBooksfilter && readedBooksfilter.length === 0 ? (
              <div className={styles.noposts}>
                <p>Não foram encontrados livros lidos</p>
              </div>
            ) : (
              <div className={styles.post_header}>
                <span>Título</span>
              </div>
            )
          }

          {
            readedBooksfilter &&
            readedBooksfilter.map((book) => (
              <div className={styles.post_row} key={book.id}>
                <p>{book.title}</p>
                <div className={styles.actions}>
                  <Link to={`/books/${book.id}`} className="btn btn-outline">
                    Ver
                  </Link>
                </div>
              </div>
            ))
          }
        </div >
      </>

    ) : (
      <p>rereorkoekroekro</p>
    )

  );
};

export default Dashboard;
