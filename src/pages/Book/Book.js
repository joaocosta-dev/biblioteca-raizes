import styles from "./Book.css";

// hooks
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Button from '@mui/material/Button';

const Book = () => {
  const [additionalDays, setAdditionalDays] = useState(0)
  const { id } = useParams();
  const { document: book } = useFetchDocument("books", id); // Alterado para buscar 'books'
  const navigate = useNavigate();

  const daysUntilSunday = () => {
    const today = new Date(); // Pega a data de hoje
    const dayOfWeek = today.getDay(); // Pega o dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)

    // Se for domingo, falta 0 dias, caso contrário calcula a diferença até o próximo domingo
    const daysToSunday = (7 - dayOfWeek) % 7;

    return daysToSunday;
  };

  const { updateDocument, response } = useUpdateDocument("books");


  const returnDeadline = () => {
    const today = new Date()
    today.setDate(today.getDate() + daysUntilSunday() + Math.round(book.pages / 10) + additionalDays)
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses em JavaScript são de 0-11
    const year = today.getFullYear();
    const deadlineFormatted = `${day}/${month}/${year}`;


    return deadlineFormatted
  };

  const handleLocate = (e) => {
    e.preventDefault();
    updateDocument(id, { available: false })
    navigate("/");
  }

  const handleAddDays = (p) => {
    setAdditionalDays(p)
  }

  return (
    <div className="book-container container flex justify-around py-14">
      <div className="left-content">
        {book && (
          <>
            <div className="author mb-6 p-2">
              <h1 className="font-bold text-3xl ms-1">{book.title}</h1> {/* Título do livro */}
              <h2 className="font-medium text-2xl ms-1">{book.author}</h2> {/* Autor do livro */}
            </div>
            <p className="max-w-[550px] text-xl font-medium mb-6">{book.description}</p> {/* Descrição do livro */}

            <h3 className="text-lg mb-1">Tags deste livro:</h3>
            <div className="box-tag-book mb-8">
              {book.tags.split(',').map((tag) => (
                <p className="tag-book" key={tag}>
                  {tag}
                </p>
              ))}
            </div>

            <p className="mb-3">
              <strong>Disponível:</strong> {book.available ? "Sim" : "Não"} {/* Disponibilidade */}
            </p>
            {/* <p>
              <strong>Criado por:</strong> {book.createdBy}  Usuário que criou 
            </p> */}
            {book.available === true && (
              <>
                <p className="text-lg font-medium mb-3">O prazo de devolução começa a partir da retirada no próximo domingo<br></br> O livro precisa ser devolvido em: {returnDeadline()}</p>
                <Button
                  sx={{backgroundColor: "black"}} 
                  variant="contained"
                  className="w-full"
                  onClick={handleLocate}
                >
                  Locar
                </Button>
              </>
            )}
            {book.available === false && (
              <>
                {/* <p>Voce tem até dia {returnDeadline()} para devolução do livro<br />
                  Gostaria de solicitar mais {Math.round(book.pages / 20)} dia(s)?</p> */}
                <Button 
                  sx={{backgroundColor: "black"}} 
                  variant="contained"
                  className="w-full"
                  onClick={() => handleAddDays(Math.round(book.pages / 20))}
                >
                    Solicitar
                </Button>
              </>
            )}
          </>
        )}
      </div>
      <div className="right-content">
        {book && (
          <img src={book.image} alt={book.title} />
        )}
      </div>
    </div>
  );
};

export default Book;