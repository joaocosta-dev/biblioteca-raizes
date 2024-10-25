
import styles from "../styles/bookdetail.css"; // Atualize o nome do arquivo CSS se necessário

const BookDetail = ({ book }) => {
  return (
    <>

      {book ? (
        <>
          {book.available && (
            <div className="book-detail">
              <img  src={book.image} alt={book.title} />
            </div>
          )}
          {!book.available && (
            <div className="book-detail-indisp">
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
