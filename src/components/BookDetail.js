import { Link } from "react-router-dom";

import styles from "./BookDetail.module.css"; // Atualize o nome do arquivo CSS se necessário

const BookDetail = ({ book }) => {
  return (
    <>

      {book ? (
        <>
          {book.available && (
            <div className={styles.book_detail}>
              <img  src={book.image} alt={book.title} />
            </div>
          )}
          {!book.available && (
            <div className={styles.book_detail_indisp}>
              <img src={book.image} alt={book.title} />
            </div>
          )}
        </>
      ) : (
        <p>Carregando </p>
      )}
    </>

  );
};

export default BookDetail;
